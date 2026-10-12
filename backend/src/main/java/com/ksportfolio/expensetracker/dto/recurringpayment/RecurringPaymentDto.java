package com.ksportfolio.expensetracker.dto.recurringpayment;

import com.ksportfolio.expensetracker.dto.category.CategoryDto;
import com.ksportfolio.expensetracker.type.DurationType;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class RecurringPaymentDto {
    private Integer id;
    private String name;
    private String description;
    private DurationType recurring;
    private Integer day;
    private Integer month;
    private BigDecimal amount;
    private CategoryDto category;
    private Integer userId;
    private Boolean active;
    private LocalDate endDate;
    private Instant createdAt;
    private Instant modifiedAt;
}
