package com.ksportfolio.expensetracker.dto.payment;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentRequestDto(
    @NotBlank @Size(max = 100) String name,
    @Size(max = 300) String description,
    @NotNull Integer categoryId,
    @NotNull LocalDate dueDate,
    @NotNull @DecimalMin(value = "0", inclusive = false) BigDecimal amount
) {}
