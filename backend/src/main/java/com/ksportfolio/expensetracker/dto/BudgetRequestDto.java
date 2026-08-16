package com.ksportfolio.expensetracker.dto;


import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BudgetRequestDto {
    @NotNull
    @DecimalMin(value = "0", inclusive = false)
    private BigDecimal amount;
    @NotNull
    private DurationType durationType;
    @NotNull
    private Integer category;
}
