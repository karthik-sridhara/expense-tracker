package com.ksportfolio.expensetracker.config;

import com.ksportfolio.expensetracker.constant.AppConstant;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class TraceIdFilter extends OncePerRequestFilter {

    private static final String HEADER = "X-Trace-Id";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain chain
    ) throws ServletException, IOException {
        String traceId = request.getHeader(HEADER);
        if (traceId == null || !traceId.matches("[A-Za-z0-9-]{8,64}")) {
            traceId = UUID.randomUUID().toString();
        }
        MDC.put(AppConstant.Trace_ID, traceId);
        response.setHeader(HEADER, traceId);
        try {
            chain.doFilter(request, response);
        } finally {
            MDC.remove(AppConstant.Trace_ID);
        }
    }
}