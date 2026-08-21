package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.BudgetDto;
import com.ksportfolio.expensetracker.dto.BudgetRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Budget;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.BudgetMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.BudgetRepo;
import com.ksportfolio.expensetracker.repository.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepo budgetRepo;
    private final CategoryRepo categoryRepo;
    private final AppUserRepo appUserRepo;

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

    @Transactional
    public void addBudget(BudgetRequestDto request, Integer userId) {
        Category category = categoryRepo.findById(request.getCategory()).orElseThrow(
                ()->new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,request.getCategory())
        );
        if(!category.getIsUniversal() && !category.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND, request.getCategory());
        }
        AppUser user =  appUserRepo.getReferenceById(userId);
        boolean isExist = budgetRepo.existsByDurationTypeAndCategoryIdAndUserId(request.getDurationType(),request.getCategory(),userId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.BUDGET_EXISTS,request.getCategory(),request.getDurationType());
        }
        Budget budget = BudgetMapper.toEntity(request, user, category);
        budgetRepo.save(budget);
    }

    @Transactional
    public void updateBudget(BudgetRequestDto request, Integer userId, Integer budgetId) {
        Budget budget = budgetRepo.findById(budgetId).orElseThrow(
                ()->new  BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,budgetId)
        );

        if(!budget.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }

        Category category = categoryRepo.findById(request.getCategory()).orElseThrow(
                ()->new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,request.getCategory())
        );

        if(!category.getIsUniversal() && !category.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND, request.getCategory());
        }

        boolean isExist = budgetRepo.existsByDurationTypeAndCategoryIdAndUserIdAndIdNot(request.getDurationType(),request.getCategory(),userId,budgetId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.BUDGET_EXISTS,request.getCategory(),request.getDurationType());
        }
        BudgetMapper.toEntity(request,budget,category);
        budgetRepo.save(budget);
    }

    @Transactional
    public void deleteBudget(Integer budgetId, Integer userId) {
        Budget budget = budgetRepo.findById(budgetId).orElseThrow(
                ()->new  BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,budgetId)
        );

        if(!budget.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }
        budgetRepo.delete(budget);
    }

}
