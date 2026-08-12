package com.ksportfolio.expensetracker.exception;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.response.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;

import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessLogicException.class)
    public ResponseEntity<ApiError> handleApiException(BusinessLogicException ex, HttpServletRequest request) {

        String traceId = UUID.randomUUID().toString();
        log.warn("[{}] {} - {}", traceId, ex.getErrorCode().getCode(), ex.getMessage());

        ApiError error = new ApiError(
                ex.getErrorCode().getCode(),
                ex.getMessage(),
                ex.getErrorCode().getHttpStatus(),
                traceId
        );
        return error.toResponseEntity();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String traceId = UUID.randomUUID().toString();
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }
        log.warn("[{}] {} - validation failed: {}", traceId, ErrorCode.VALIDATION_FAILED.getCode(), ErrorCode.VALIDATION_FAILED.formatMessage());

        ApiError error = new ApiError(
                ErrorCode.VALIDATION_FAILED,
                fieldErrors,
                traceId
        );
        return error.toResponseEntity();
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String traceId = UUID.randomUUID().toString();
        log.error("[{}] {} - {}", traceId, ErrorCode.DATA_INTEGRITY_VIOLATION.getCode(), ex.getMessage());

        ApiError error = new ApiError(
                ErrorCode.DATA_INTEGRITY_VIOLATION,
                traceId
        );
        return error.toResponseEntity();
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneral(Exception ex, HttpServletRequest request) {
        String traceId = UUID.randomUUID().toString();
        log.error("[{}] Unhandled exception", traceId, ex); // full stack trace goes server-side only

        ApiError error = new ApiError(
                ErrorCode.INTERNAL_ERROR,
                traceId
        );
        return error.toResponseEntity();
    }
}
