package com.ksportfolio.expensetracker.security;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.response.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import tools.jackson.databind.ObjectMapper;


import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ObjectMapper objectMapper;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain appFilterChain(
            HttpSecurity http,
            @Qualifier("appCorsConfigurationSource")
            CorsConfigurationSource corsConfigurationSource,
            @Qualifier("public-paths") List<String> publicPaths,
            @Qualifier("admin-paths") List<String> adminPaths,
            @Qualifier("employee-paths") List<String> employeePaths,
            @Qualifier("secured-paths") List<String> securedPaths
    ) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfigurationSource));
        http.formLogin(AbstractHttpConfigurer::disable);
        http.httpBasic(AbstractHttpConfigurer::disable);
        http.sessionManagement(smc -> smc.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.authorizeHttpRequests(request -> {
            publicPaths.forEach(path -> request.requestMatchers(path).permitAll());
            adminPaths.forEach(path -> request.requestMatchers(path).hasRole("ADMIN"));
            employeePaths.forEach(path -> request.requestMatchers(path).hasRole("EMPLOYEE"));
            securedPaths.forEach(path -> request.requestMatchers(path).authenticated());
            request.anyRequest().denyAll();
        });
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.exceptionHandling(exception -> {
            exception.accessDeniedHandler(
               (request, response, handler) -> handleAuthorizationException(request,response,ErrorCode.ACCESS_DENIED)
            );
            exception.authenticationEntryPoint(
                (request, response, handler) -> handleAuthorizationException(request,response,ErrorCode.UNAUTHORIZED)
            );
        });
        return http.build();
    }

    @Bean("appCorsConfigurationSource")
    public CorsConfigurationSource corsConfigurationSource(
        @Value("${app.config.cors.origin}")
        List<String> origins
    ) {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowedOrigins(origins);
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }

    private void handleAuthorizationException(HttpServletRequest request, HttpServletResponse response, ErrorCode errorCode) throws IOException {
        String traceId = UUID.randomUUID().toString();

        ApiError error = new ApiError(
                errorCode,
                traceId
        );

        response.setStatus(errorCode.getHttpStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(), error);
    }

}