package com.ksportfolio.expensetracker.config;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Slf4j
@Component
public class LoggingAspect {

    Logger auditLogger = LoggerFactory.getLogger("AUDIT");

    @Around("within(com.ksportfolio.expensetracker.controller..*)")
    public Object auditLog(ProceedingJoinPoint pjp) throws Throwable {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return pjp.proceed();
        }
        HttpServletRequest request = attrs.getRequest();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String user = (auth != null && auth.isAuthenticated()) ? auth.getName() : "anonymous";

        long start = System.currentTimeMillis();
        String outcome = "SUCCESS";
        String error = "-";
        try {
            Object result = pjp.proceed();
            if (result instanceof ResponseEntity<?> re && !re.getStatusCode().is2xxSuccessful()) {
                outcome = "FAILURE";
            }
            return result;
        } catch (Throwable t) {
            outcome = "FAILURE";
            error = t.getClass().getSimpleName();
            throw t;
        } finally {
            auditLogger.info(
                "user={} method={} uri={} handler={} ip={} outcome={} error={} durationMs={}",
                user, request.getMethod(), request.getRequestURI(),
                pjp.getSignature().toShortString(), request.getRemoteAddr(),
                outcome, error, System.currentTimeMillis() - start
            );
        }
    }

    @Around("within(com.ksportfolio.expensetracker.controller..*) || within(com.ksportfolio.expensetracker.service..*)")
    public Object logExecution(ProceedingJoinPoint pjp) throws Throwable {
        String method = pjp.getSignature().toShortString();
        long start = System.currentTimeMillis();
        log.debug("→ {}", method);
        Object result = pjp.proceed();
        log.debug("← {} completed in {} ms", method, System.currentTimeMillis() - start);
        return result;
    }
}