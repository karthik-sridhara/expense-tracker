package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepo extends JpaRepository<Budget, Integer> {
}
