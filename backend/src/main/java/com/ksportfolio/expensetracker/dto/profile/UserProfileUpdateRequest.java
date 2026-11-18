package com.ksportfolio.expensetracker.dto.profile;

import com.ksportfolio.expensetracker.type.Gender;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UserProfileUpdateRequest(
    @NotBlank @Size(max = 100) String name,
    Gender gender,
    @Past LocalDate dob,
    @DecimalMin(value = "0", inclusive = false) BigDecimal income,
    @NotBlank @Pattern(regexp = "^[A-Z]{3}$", message = "must be a 3-letter ISO currency code") String currency,
    @NotBlank @Size(max = 50) String timezone
) {}
