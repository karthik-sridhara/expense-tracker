package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.payment.PaymentDto;
import com.ksportfolio.expensetracker.entity.Payment;

public class PaymentMapper {

    public static PaymentDto toDto(Payment p) {
        return new PaymentDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getCategory().getId(),
                p.getCategory().getName(),
                p.getDueDate(),
                p.getAmount(),
                p.getTransaction() != null
        );
    }
}
