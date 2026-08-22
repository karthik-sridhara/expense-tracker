package com.ksportfolio.expensetracker.dto;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class AppUserRequestDto {
    @NotNull
    @NotBlank
    @Size(min = 1, max = 100)
    String name;
    @NotNull
    @Pattern(regexp = "[MF]", message = "Gender must be M or F")
    String gender;
    @NotNull
    LocalDate dob;
    @NotNull
    @Email
    String email;
    @NotNull
    @NotBlank
    @Size(min = 8, max = 100)
    String password;
    @NotNull
    @Pattern(regexp = "ADMIN|EMPLOYEE|USER", message = "role must be one of: admin, employee, user")
    String role;
}


