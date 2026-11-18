package com.ksportfolio.expensetracker.dto.appuser;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AppUserRequestDto {
    @NotNull
    @Email
    private String email;
    @NotNull
    @Pattern(regexp = "ADMIN|EMPLOYEE|USER", message = "role must be one of: admin, employee, user")
    private String role;
    @NotNull
    private Integer version;
}


