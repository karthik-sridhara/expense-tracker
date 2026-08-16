package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.BudgetDto;
import com.ksportfolio.expensetracker.dto.BudgetRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Budget;
import com.ksportfolio.expensetracker.entity.Category;

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


    public static Budget toEntity(BudgetRequestDto dto, AppUser user, Category category) {
        return toEntity(dto, user, category, null);
    }

    public static Budget toEntity(BudgetRequestDto dto, AppUser user, Category category, Integer budgetId) {
        if (dto == null) {
            return null;
        }
        Budget budget = new Budget();
        budget.setId(budgetId);
        budget.setAmount(dto.getAmount());
        budget.setDurationType(dto.getDurationType());
        budget.setCategory(category);
        budget.setUser(user);
        return budget;
    }

    public static Budget toEntity(BudgetRequestDto dto, Budget budget,Category category) {
        if (dto == null) {
            return null;
        }
        budget.setAmount(dto.getAmount());
        budget.setDurationType(dto.getDurationType());
        budget.setCategory(category);
        return budget;
    }
}
