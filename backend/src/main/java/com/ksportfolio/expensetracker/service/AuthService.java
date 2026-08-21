package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.auth.LoginResponseDto;

public interface AuthService {
    LoginResponseDto authenticate(String username, String password);
}
