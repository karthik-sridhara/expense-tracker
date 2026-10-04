package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.apptransaction.AppTransactionDto;
import com.ksportfolio.expensetracker.entity.AppTransaction;

public class AppTransactionMapper {

    public static AppTransactionDto toDto(AppTransaction appTransaction) {
        return toDtoInternal(appTransaction);
    }

    public static AppTransactionDto toDtoWithUser(AppTransaction appTransaction) {
        AppTransactionDto dto = toDtoInternal(appTransaction);
        dto.setUserId(appTransaction.getUser().getId());
        return dto;
    }

    private static AppTransactionDto toDtoInternal(AppTransaction appTransaction) {
        AppTransactionDto dto = new AppTransactionDto();
        dto.setId(appTransaction.getId());
        dto.setName(appTransaction.getName());
        dto.setDescription(appTransaction.getDescription());
        dto.setAmount(appTransaction.getAmount());
        dto.setTransactionDate(appTransaction.getTransactionDate());
        dto.setCreatedAt(appTransaction.getCreatedAt());
        dto.setModifiedAt(appTransaction.getModifiedAt());
        dto.setCategory(CategoryMapper.toDto(appTransaction.getCategory()));
        return dto;
    }
}
