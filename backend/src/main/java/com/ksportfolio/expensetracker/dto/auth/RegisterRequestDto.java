package com.ksportfolio.expensetracker.dto.auth;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class RegisterRequestDto {
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
}
