package com.ksportfolio.expensetracker.dto.response;

import lombok.Getter;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@Getter
public class ApiMessage {
    private final String message;
    private final String code;
    private final Map<String, String> data;

    public ApiMessage(String code, String message) {
        this(code,message,null);
    }
    public ApiMessage(String code, String message, Map<String, String> details) {
        this.code = code;
        this.message = message;
        this.data = details;
    }



}
