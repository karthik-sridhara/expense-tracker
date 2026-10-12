package com.ksportfolio.expensetracker.dto.recurringpayment;

import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class RecurringPaymentRequestDto {

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 300)
    private String description;

    @NotNull
    private DurationType recurring;

    @Min(1)
    @Max(31)
    private Integer day;

    @Min(1)
    @Max(12)
    private Integer month;

    @NotNull
    @Positive
    @Digits(integer = 10, fraction = 2)
    private BigDecimal amount;

    @NotNull
    private Integer category;

    private LocalDate endDate;
}