package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.BudgetDto;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.BudgetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getAll() {
        ApiResponse<List<BudgetDto>> response = new ApiResponse<>(
                "Budgets retrieved successfully", budgetService.getAll()
        );
        return response.toResponseEntity();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getAllByUserId(@PathVariable("userId") Integer userId) {
        ApiResponse<List<BudgetDto>> response = new ApiResponse<>(
                "Budgets retrieved successfully", budgetService.getByUser(userId)
        );
        return response.toResponseEntity();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BudgetDto>> getById(@PathVariable("id") Integer id) {
        ApiResponse<BudgetDto> response = new ApiResponse<>(
                "Budget retrieved successfully", budgetService.getById(id)
        );
        return response.toResponseEntity();
    }


}
