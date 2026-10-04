package com.ksportfolio.expensetracker.dto.apptransaction;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class AppTransactionRequestDto {

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 300)
    private String description;

    @NotNull
    private Integer category;

    @NotNull
    @Positive
    @Digits(fraction = 2, integer = 10)
    private BigDecimal amount;

    @NotNull
    private Instant transactionDate;
}
