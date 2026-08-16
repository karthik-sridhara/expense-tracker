package com.ksportfolio.expensetracker.service.impl;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.BudgetDto;
import com.ksportfolio.expensetracker.entity.Budget;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.BudgetMapper;
import com.ksportfolio.expensetracker.repository.BudgetRepo;
import com.ksportfolio.expensetracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private final BudgetRepo budgetRepo;

    public List<BudgetDto> getAll() {
        List<Budget> budgets = budgetRepo.findAll();
        List<BudgetDto> budgetDtos = new ArrayList<>();
        for (Budget budget : budgets) {
            budgetDtos.add(BudgetMapper.toDto(budget));
        }
        return budgetDtos;
    }

    public BudgetDto getById(Integer id) {
        Optional<Budget> budget = budgetRepo.findById(id);
        return budget.map(BudgetMapper::toDto).orElseThrow(
                ()->new BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,id)
        );
    }

    public List<BudgetDto> getByUser(Integer userId) {
        List<Budget> budgets = budgetRepo.findByUserId(userId);
        List<BudgetDto> budgetDtos = new ArrayList<>();
        for (Budget budget : budgets) {
            budgetDtos.add(BudgetMapper.toDto(budget));
        }
        return budgetDtos;
    }

}
