package com.ksportfolio.expensetracker.dto.payment;


import java.math.BigDecimal;
import java.time.LocalDate;

public record PaymentDto(
    Integer id,
    String name,
    String description,
    Integer categoryId,
    String categoryName,
    LocalDate dueDate,
    BigDecimal amount,
    boolean completed
) {}