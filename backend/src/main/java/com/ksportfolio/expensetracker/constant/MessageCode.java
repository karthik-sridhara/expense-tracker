package com.ksportfolio.expensetracker.constant;

import lombok.Getter;

@Getter
public enum MessageCode {

    USER_NOT_FOUND("INF-888","User not found");

    private final String message;
    private final String code;

    MessageCode(String code, String message) {
        this.code = code;
        this.message = message;
    }


}
