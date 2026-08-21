package com.ksportfolio.expensetracker.security;

import com.ksportfolio.expensetracker.constant.AppConstant;
import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader(AppConstant.TOKEN_HEADER);

        if (authHeader == null || !authHeader.startsWith(AppConstant.TOKEN_HEADER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(AppConstant.TOKEN_HEADER_PREFIX.length());

        try {
            Claims claims = jwtService.extractClaims(token);
            String email = claims.getSubject();
            String role = claims.get(AppConstant.TOKEN_CLAIM_ROLE, String.class);
            String name = claims.get(AppConstant.TOKEN_CLAIM_NAME, String.class);
            Integer userId = claims.get(AppConstant.TOKEN_CLAIM_USERID, Integer.class);
            boolean isTokenExpired = claims.getExpiration().before(new Date());
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                if (!isTokenExpired) {
                    AppUserDetails user = new AppUserDetails(
                            userId,
                            email,
                            null,
                            name,
                            role
                    );
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception ex) {
            // invalid/expired token, or user no longer exists — leave SecurityContext empty,
            // request proceeds unauthenticated and gets rejected downstream if the endpoint requires auth
            System.out.println(ex.getMessage());
        }
        filterChain.doFilter(request, response);
    }
}