package com.ksportfolio.expensetracker.dto.response;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.Map;

@Getter
public class ApiError {
    private final String message;
    private final String code;
    private final HttpStatus httpStatus;
    private final Map<String, String> data;
    private final Instant timeStamp;
    private final String traceId;

    public ApiError(String code,String message, HttpStatus httpStatus, Map<String, String> data,String traceId) {
        this.message = message;
        this.httpStatus = httpStatus;
        this.data = data;
        this.code = code;
        this.timeStamp = Instant.now();
        this.traceId = traceId;
    }

    public ApiError(String code,String message, HttpStatus httpStatus,String traceId) {
        this(code, message, httpStatus, null, traceId);
    }

    public ApiError(ErrorCode errorCode,Map<String,String> data ,String traceId) {
        this(errorCode.getCode(), errorCode.formatMessage(), errorCode.getHttpStatus(), data, traceId);
    }

    public ApiError(ErrorCode errorCode, String traceId) {
        this(errorCode.getCode(), errorCode.formatMessage(), errorCode.getHttpStatus(), traceId);
    }

    public ApiError(ErrorCode errorCode,String message, String traceId) {
        this(errorCode.getCode(), message, errorCode.getHttpStatus(), traceId);
    }

    public ResponseEntity<ApiError> toResponseEntity() {
        return new ResponseEntity<>(this,httpStatus);
    }

}
