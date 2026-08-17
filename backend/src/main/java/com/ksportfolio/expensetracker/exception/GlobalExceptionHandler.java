package com.ksportfolio.expensetracker.exception;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.response.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;

import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tools.jackson.databind.exc.InvalidFormatException;

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

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiError> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        String traceId = UUID.randomUUID().toString();

        log.warn("[{}] {} - {}", traceId, ErrorCode.HTTP_METHOD_NOT_SUPPORTED.getCode(), ex.getMessage());

        ApiError error = new ApiError(
                ErrorCode.HTTP_METHOD_NOT_SUPPORTED,
                traceId
        );
        return error.toResponseEntity();
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleUnreadableBody(HttpMessageNotReadableException ex, HttpServletRequest request) {
        String traceId = UUID.randomUUID().toString();
        ErrorCode errorCode = ErrorCode.MALFORMED_REQUEST_BODY;
        String message = ErrorCode.MALFORMED_REQUEST_BODY.formatMessage();

        Throwable cause = ex.getCause();
        if (cause instanceof InvalidFormatException ife) {
            String fieldName = ife.getPath().isEmpty()
                    ? "unknown field"
                    : ife.getPath().get(ife.getPath().size() - 1).getPropertyName();

            errorCode = ErrorCode.INVALID_FORMAT;
            message = ErrorCode.INVALID_FORMAT.formatMessage(ife.getValue(), fieldName);
        }

        log.warn("[{}] {} - {}", traceId, errorCode.getCode(), message);

        ApiError error = new ApiError(
                errorCode,
                message,
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
