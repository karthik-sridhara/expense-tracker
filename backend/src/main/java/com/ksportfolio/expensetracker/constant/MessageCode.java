package com.ksportfolio.expensetracker.constant;

import lombok.Getter;

import java.text.MessageFormat;

@Getter
public enum MessageCode {

    DELETED_PAYMENT_LINKED_TRANSACTION("INF-1001","Deleted payment linked transaction : {0}"),;

    private final String message;
    private final String code;

    MessageCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public String formatMessage(Object... args) {
        return MessageFormat.format(message, args);
    }

}
