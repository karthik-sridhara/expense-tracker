package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.BudgetDto;
import com.ksportfolio.expensetracker.dto.BudgetRequestDto;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> addBudget(@PathVariable("userId") Integer userId, @RequestBody @Valid BudgetRequestDto request) {
        budgetService.addBudget(request, userId);
        ApiResponse<Void> response = new ApiResponse<>(
                "Budget added successfully", null
        );
        return response.toResponseEntity();
    }

    @PutMapping("/user/{userId}/budget/{id}")
    public ResponseEntity<ApiResponse<Void>> updateBudget(@PathVariable("userId") Integer userId, @PathVariable("id") Integer id, @RequestBody @Valid BudgetRequestDto request) {
        budgetService.updateBudget(request, userId, id);
        ApiResponse<Void> response = new ApiResponse<>(
                "Budget updated successfully", null
        );
        return response.toResponseEntity();
    }

    @DeleteMapping("/user/{userId}/budget/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable("userId") Integer userId, @PathVariable("id") Integer id) {
        budgetService.deleteBudget(id, userId);
        ApiResponse<Void> response = new ApiResponse<>(
                "Budget deleted successfully", null
        );
        return response.toResponseEntity();
    }
}
