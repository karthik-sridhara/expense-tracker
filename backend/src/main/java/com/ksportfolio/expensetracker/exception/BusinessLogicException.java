package com.ksportfolio.expensetracker.exception;


import com.ksportfolio.expensetracker.constant.ErrorCode;
import lombok.Getter;


@Getter
public class BusinessLogicException extends RuntimeException {
    private final ErrorCode errorCode;

    public BusinessLogicException(ErrorCode errorCode, Object... args) {
        super(errorCode.formatMessage(args));
        this.errorCode = errorCode;
    }
}
