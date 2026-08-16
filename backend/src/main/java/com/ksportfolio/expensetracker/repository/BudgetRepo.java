package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BudgetRepo extends JpaRepository<Budget, Integer> {
    List<Budget> findByUserId(Integer userId);
}
