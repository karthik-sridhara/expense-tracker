package com.ksportfolio.expensetracker.constant;

import org.springframework.http.HttpStatus;

import java.text.MessageFormat;

public enum ErrorCode {

    VALIDATION_FAILED("ERR-1000", HttpStatus.BAD_REQUEST, "Validation failed"),
    RESOURCE_NOT_FOUND("ERR-1001", HttpStatus.NOT_FOUND, "{0} not found with id: {1}"),
    DUPLICATE_RESOURCE("ERR-1002", HttpStatus.CONFLICT, "{0} already exists"),
    ACCESS_DENIED("ERR-1003", HttpStatus.FORBIDDEN, "Access denied"),
    DATA_INTEGRITY_VIOLATION("ERR-1005", HttpStatus.CONFLICT, "A database constraint was violated"),
    HTTP_METHOD_NOT_SUPPORTED("ERR-1006", HttpStatus.METHOD_NOT_ALLOWED, "HTTP method not supported"),
    MALFORMED_REQUEST_BODY("ERR-1007", HttpStatus.BAD_REQUEST, "Malformed request body"),
    INVALID_FORMAT("ERR-1008", HttpStatus.BAD_REQUEST, "Invalid value {0} provided for field {1}"),
    INTERNAL_ERROR("ERR-1999", HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred"),

    USER_NOT_FOUND("ERR-2000", HttpStatus.BAD_REQUEST,"User not found with id: {0}"),
    USER_NOT_FOUND_WITH_EMAIL("ERR-2001", HttpStatus.BAD_REQUEST,"User not found with email: {0}"),
    CATEGORY_NOT_FOUND("ERR-2002", HttpStatus.BAD_REQUEST,"Category not found with id: {0}"),
    BUDGET_NOT_FOUND("ERR-2003", HttpStatus.BAD_REQUEST,"Budget not found with id: {0}"),
    BUDGET_EXISTS("ERR-2004", HttpStatus.BAD_REQUEST,"Budget already exists for category: {0} and duration type: {1}"),
    ;

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
