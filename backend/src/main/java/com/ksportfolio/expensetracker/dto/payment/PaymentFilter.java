package com.ksportfolio.expensetracker.dto.payment;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PaymentFilter {
    private Integer userId;          // required
    private String searchText;       // name / description
    private Integer categoryId;
    private Boolean completed;       // true = transaction present, false = not
    private LocalDate dueFrom;
    private LocalDate dueTo;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
}