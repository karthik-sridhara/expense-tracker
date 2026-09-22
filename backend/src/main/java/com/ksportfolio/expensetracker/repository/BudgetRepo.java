package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Budget;
import com.ksportfolio.expensetracker.type.DurationType;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface BudgetRepo extends JpaRepository<Budget, Integer>, JpaSpecificationExecutor<Budget> {
    List<Budget> findByUserId(Integer userId, Specification<Budget> spec);
    boolean existsByDurationTypeAndCategoryIdAndUserId(DurationType durationType,Integer categoryId ,Integer userId);
    boolean existsByDurationTypeAndCategoryIdAndUserIdAndIdNot(DurationType durationType,Integer categoryId ,Integer userId,Integer budgetId);
    Optional<Budget> findByUserIdAndId(Integer userId, Integer id);
}
