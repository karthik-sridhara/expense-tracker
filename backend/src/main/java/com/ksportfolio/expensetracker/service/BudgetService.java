package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.BudgetDto;
import com.ksportfolio.expensetracker.dto.BudgetRequestDto;

import java.util.List;

public interface BudgetService {
    List<BudgetDto> getAll();
    BudgetDto getById(Integer id);
    List<BudgetDto> getByUser(Integer userId);
    void addBudget(BudgetRequestDto request, Integer userId);
    void updateBudget(BudgetRequestDto request, Integer userId, Integer id);
    void deleteBudget(Integer id, Integer userId);
}
