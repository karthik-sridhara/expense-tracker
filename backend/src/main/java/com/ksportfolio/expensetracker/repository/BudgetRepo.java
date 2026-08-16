package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Budget;
import com.ksportfolio.expensetracker.type.DurationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepo extends JpaRepository<Budget, Integer> {
    List<Budget> findByUserId(Integer userId);
    boolean existsByDurationTypeAndCategoryIdAndUserId(DurationType durationType,Integer categoryId ,Integer userId);
    boolean existsByDurationTypeAndCategoryIdAndUserIdAndIdNot(DurationType durationType,Integer categoryId ,Integer userId,Integer budgetId);

}
