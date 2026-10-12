package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.recurringpayment.RecurringPaymentDto;
import com.ksportfolio.expensetracker.entity.RecurringPayment;

public class RecurringPaymentMapper {

    private RecurringPaymentMapper() {}

    public static RecurringPaymentDto toDto(RecurringPayment e) {
        RecurringPaymentDto dto = new RecurringPaymentDto();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setDescription(e.getDescription());
        dto.setRecurring(e.getRecurring());
        dto.setDay(e.getDay());
        dto.setMonth(e.getMonth());
        dto.setAmount(e.getAmount());
        dto.setCategory(CategoryMapper.toDto(e.getCategory()));
        dto.setUserId(e.getUser().getId()); // id read from lazy proxy, no extra query
        dto.setActive(e.getActive());
        dto.setEndDate(e.getEndDate());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setModifiedAt(e.getModifiedAt());
        return dto;
    }
}
