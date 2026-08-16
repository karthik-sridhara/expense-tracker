package com.ksportfolio.expensetracker.dto;

import com.ksportfolio.expensetracker.type.DurationType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class BudgetDto {
    private Integer id;
    private BigDecimal amount;
    private DurationType durationType;
    private CategoryDto category;
    private Integer userId;
    private Instant createdAt;
    private Instant modifiedAt;
}
