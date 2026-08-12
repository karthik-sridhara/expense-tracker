package com.ksportfolio.expensetracker.constant;

import org.springframework.http.HttpStatus;

import java.text.MessageFormat;

public enum ErrorCode {

    VALIDATION_FAILED("ERR-1000", HttpStatus.BAD_REQUEST, "Validation failed"),
    RESOURCE_NOT_FOUND("ERR-1001", HttpStatus.NOT_FOUND, "{0} not found with id: {1}"),
    DUPLICATE_RESOURCE("ERR-1002", HttpStatus.CONFLICT, "{0} already exists"),
    ACCESS_DENIED("ERR-1003", HttpStatus.FORBIDDEN, "Access denied"),
    DATA_INTEGRITY_VIOLATION("ERR-1005", HttpStatus.CONFLICT, "A database constraint was violated"),
    INTERNAL_ERROR("ERR-1999", HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");

    private final String code;
    private final HttpStatus httpStatus;
    private final String messageTemplate;

    ErrorCode(String code, HttpStatus httpStatus, String messageTemplate) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.messageTemplate = messageTemplate;
    }

    public String getCode() {
        return code;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String formatMessage(Object... args) {
        return MessageFormat.format(messageTemplate, args);
    }
}
