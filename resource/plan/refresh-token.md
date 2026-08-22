# JWT Access + Refresh Token Example

This document shows a self-contained example of adding **access + refresh tokens** on top of the
existing JWT-only authentication setup (`AuthController`, `JwtUtil`, `JobPortalSecurityConfig`,
`JwtConfig`). It only covers the *new* pieces needed for refresh-token support — it assumes the
existing login/authentication/authorization flow (custom `JobPortalUsernamePwdAuthenticationProvider`
+ `oauth2ResourceServer().jwt()` + roles-claim based authorization) stays as-is.

> Status: **Not yet applied to the codebase** — this is a proposal/example for review.

## Why

The current implementation issues a single JWT valid for 24 hours with no way to revoke it if
leaked. Splitting into a short-lived **access token** (used on every API call, fully stateless) and
a longer-lived **refresh token** (tracked in the DB so it can be revoked) fixes that while staying
100% JWT-based (no sessions, no cookies).

## 1. New entity to track refresh tokens (for revocation)

​```java
@Entity
@Table(name = "refresh_tokens")
@Getter @Setter
public class RefreshToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token_id", nullable = false, unique = true, length = 64)
    private String tokenId; // the JWT's "jti" claim

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;
}
​```

​```java
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenId(String tokenId);
}
​```

## 2. `JwtUtil` additions

​```java
public String generateAccessToken(Authentication authentication) {
    var user = (JobPortalUser) authentication.getPrincipal();
    return Jwts.builder()
            .issuer("Job Portal").subject(user.getEmail())
            .claim("name", user.getName())
            .claim("roles", rolesCsv(authentication))
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 15 * 60 * 1000)) // 15 min
            .signWith(secretKey).compact();
}

public String generateRefreshToken(JobPortalUser user, RefreshTokenRepository repo) {
    String jti = UUID.randomUUID().toString();
    RefreshToken entity = new RefreshToken();
    entity.setTokenId(jti);
    entity.setUserId(user.getId());
    entity.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));
    repo.save(entity);

    return Jwts.builder()
            .subject(user.getEmail()).id(jti)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000))
            .signWith(secretKey).compact();
}

private String rolesCsv(Authentication authentication) {
    return authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));
}
​```

## 3. New DTOs

​```java
public record TokenPairDto(String accessToken, String refreshToken) {}
public record RefreshRequestDto(String refreshToken) {}
​```

## 4. `AuthController` changes — replace single-token login, add `/refresh` and `/logout`

​```java
@PostMapping(value = "/login/public", version = "1.0")
public ResponseEntity<LoginResponseDto> apiLogin(@RequestBody LoginRequestDto loginRequestDto) {
    var resultAuthentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequestDto.username(), loginRequestDto.password()));

    var loggedInUser = (JobPortalUser) resultAuthentication.getPrincipal();
    String accessToken = jwtUtil.generateAccessToken(resultAuthentication);
    String refreshToken = jwtUtil.generateRefreshToken(loggedInUser, refreshTokenRepository);

    var userDto = new UserDto();
    BeanUtils.copyProperties(loggedInUser, userDto);
    userDto.setRole(loggedInUser.getRole().getName());
    userDto.setUserId(loggedInUser.getId());

    return ResponseEntity.ok(new LoginResponseDto(HttpStatus.OK.getReasonPhrase(), userDto,
            new TokenPairDto(accessToken, refreshToken)));
}

@PostMapping(value = "/refresh/public", version = "1.0")
public ResponseEntity<TokenPairDto> refresh(@RequestBody RefreshRequestDto request) {
    Claims claims = Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(request.refreshToken()).getPayload();

    String jti = claims.getId();
    RefreshToken stored = refreshTokenRepository.findByTokenId(jti)
            .orElseThrow(() -> new BadCredentialsException("Unknown refresh token"));

    if (stored.isRevoked() || stored.getExpiresAt().isBefore(Instant.now())) {
        throw new BadCredentialsException("Refresh token revoked or expired");
    }

    JobPortalUser user = jobPortalUserRepository.findJobPortalUserByEmail(claims.getSubject())
            .orElseThrow(() -> new BadCredentialsException("User no longer exists"));

    stored.setRevoked(true); // rotate: one-time use
    refreshTokenRepository.save(stored);

    var authorities = List.of(new SimpleGrantedAuthority(user.getRole().getName()));
    var newAuth = new UsernamePasswordAuthenticationToken(user, null, authorities);

    String newAccessToken = jwtUtil.generateAccessToken(newAuth);
    String newRefreshToken = jwtUtil.generateRefreshToken(user, refreshTokenRepository);

    return ResponseEntity.ok(new TokenPairDto(newAccessToken, newRefreshToken));
}

@PostMapping(value = "/logout/public", version = "1.0")
public ResponseEntity<Void> logout(@RequestBody RefreshRequestDto request) {
    Claims claims = Jwts.parser().verifyWith(secretKey).build()
            .parseSignedClaims(request.refreshToken()).getPayload();
    refreshTokenRepository.findByTokenId(claims.getId())
            .ifPresent(rt -> { rt.setRevoked(true); refreshTokenRepository.save(rt); });
    return ResponseEntity.noContent().build();
}
​```

## 5. Path config additions (`PathsConfig`)

​```java
"/api/auth/refresh/public",
"/api/auth/logout/public",
​```

## What this buys you

- Access token lifetime drops from 24h → 15min, shrinking the exposure window if a token leaks.
- **True logout/revocation** becomes possible (impossible with the current single-JWT design) —
  logging out or rotating a refresh token invalidates it server-side via the `revoked` flag.
- Still 100% stateless-JWT for the *access* token used on every API call — only the refresh flow
  touches the DB.

## Still to do if this is applied

- Add `refresh_tokens` table DDL to `jobportal-schema.sql`.
- Update `LoginResponseDto` to carry a `TokenPairDto` instead of a single `jwtToken` string.
- Add exception handling for expired/invalid refresh tokens in `GlobalExceptionHandler`.
- Optionally add a scheduled cleanup job to purge expired/revoked rows from `refresh_tokens`.