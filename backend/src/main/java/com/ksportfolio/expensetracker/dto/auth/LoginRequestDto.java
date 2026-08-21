package com.ksportfolio.expensetracker.dto.auth;

import com.ksportfolio.expensetracker.type.LoginType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import org.hibernate.validator.constraints.Length;

@Getter
public class LoginRequestDto {
    @NotNull
    @NotBlank
    @Email
    private String username;
    @NotNull
    @NotBlank
    @Length(min = 8, max = 20)
    private String password;
    private LoginType type;
}
