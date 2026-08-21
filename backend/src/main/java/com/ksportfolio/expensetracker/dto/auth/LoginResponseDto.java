package com.ksportfolio.expensetracker.dto.auth;

import com.ksportfolio.expensetracker.dto.AppUserDto;
import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public class LoginResponseDto {
    private String token;
    private final Integer userId;
    private final String email;
    private final String name;
    private final String role;
}
