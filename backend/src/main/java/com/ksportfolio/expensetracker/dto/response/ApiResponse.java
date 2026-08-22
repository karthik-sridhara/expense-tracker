package com.ksportfolio.expensetracker.dto.response;

import lombok.Getter;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;

@Getter
public class ApiResponse<T> {
    private final String message;
    private final T data;
    private final Instant timestamp;
    private final List<ApiMessage> info;
    private final List<ApiMessage> warnings;

    public ApiResponse(String message, T data) {
        this(message, data, null, null);
    }

    public ApiResponse(String message, T data, List<ApiMessage> info, List<ApiMessage> warnings) {
        this.message = message;
        this.data = data;
        this.timestamp = Instant.now();
        this.info = info;
        this.warnings = warnings;
    }

    public ResponseEntity<ApiResponse<T>> toResponseEntity() {
        return ResponseEntity.ok(this);
    }

}
