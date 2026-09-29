package com.ksportfolio.expensetracker.security;

import com.ksportfolio.expensetracker.constant.AppConstant;
import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.response.ApiError;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PasswordExpiryFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null && authentication.getPrincipal() instanceof AppUserDetails) {
            AppUserDetails userDetails = (AppUserDetails) authentication.getPrincipal();

            if (!userDetails.isCredentialsNonExpired()) {
                String requestUri = request.getRequestURI();

                if (!requestUri.contains(AppConstant.CHANGE_PASSWORD_URL)) {
                    String traceId = UUID.randomUUID().toString();
                    ApiError error = new ApiError(
                            ErrorCode.PASSWORD_EXPIRED,
                            traceId
                    );
                    response.setStatus(ErrorCode.PASSWORD_EXPIRED.getHttpStatus().value());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    objectMapper.writeValue(response.getWriter(), error);
                }
            }
        }

        filterChain.doFilter(request, response);
    }


}
