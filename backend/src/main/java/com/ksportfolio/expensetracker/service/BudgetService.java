package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.BudgetDto;
import java.util.List;

public interface BudgetService {
    List<BudgetDto> getAll();
    BudgetDto getById(Integer id);
    List<BudgetDto> getByUser(Integer userId);
}
