package com.ksportfolio.expensetracker.constant;

public class AppConstant {
    private AppConstant(){
        throw new IllegalStateException("Utility class");
    }
    public static final String TOKEN_CLAIM_USERID = "userId";
    public static final String TOKEN_CLAIM_ROLE = "role";
    public static final String TOKEN_CLAIM_NAME = "name";
    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_HEADER_PREFIX = "Bearer ";
}
