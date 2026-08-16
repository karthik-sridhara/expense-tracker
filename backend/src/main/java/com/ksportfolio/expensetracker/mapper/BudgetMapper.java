package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.BudgetDto;
import com.ksportfolio.expensetracker.entity.Budget;

public class BudgetMapper {
    public static BudgetDto toDto(Budget budget) {
        if (budget == null) {
            return null;
        }
        BudgetDto dto = new BudgetDto();
        dto.setId(budget.getId());
        dto.setAmount(budget.getAmount());
        dto.setDurationType(budget.getDurationType());
        dto.setCategory(CategoryMapper.toDto(budget.getCategory()));
        dto.setCreatedAt(budget.getCreatedAt());
        dto.setModifiedAt(budget.getModifiedAt());
        dto.setUserId(budget.getUser().getId());
        return dto;
    }
}
