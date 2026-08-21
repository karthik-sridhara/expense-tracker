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

    @GetMapping(version = "1.0",value = "/admin")
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getAll() {
        ApiResponse<List<BudgetDto>> response = new ApiResponse<>(
                "Budgets retrieved successfully", budgetService.getAll()
        );
        return response.toResponseEntity();
    }

    @GetMapping(version = "1.0")
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getAllByUserId() {
        ApiResponse<List<BudgetDto>> response = new ApiResponse<>(
                "Budgets retrieved successfully", budgetService.getByUser()
        );
        return response.toResponseEntity();
    }

    @GetMapping(value = "/{id}",version = "1.0")
    public ResponseEntity<ApiResponse<BudgetDto>> getById(@PathVariable("id") Integer id) {
        ApiResponse<BudgetDto> response = new ApiResponse<>(
                "Budget retrieved successfully", budgetService.getById(id)
        );
        return response.toResponseEntity();
    }

    @PostMapping(version = "1.0")
    public ResponseEntity<ApiResponse<Void>> addBudget(@RequestBody @Valid BudgetRequestDto request) {
        budgetService.addBudget(request);
        ApiResponse<Void> response = new ApiResponse<>(
                "Budget added successfully", null
        );
        return response.toResponseEntity();
    }

    @PutMapping(value="/{id}",version = "1.0")
    public ResponseEntity<ApiResponse<Void>> updateBudget(@PathVariable("id") Integer id, @RequestBody @Valid BudgetRequestDto request) {
        budgetService.updateBudget(request,id);
        ApiResponse<Void> response = new ApiResponse<>(
                "Budget updated successfully", null
        );
        return response.toResponseEntity();
    }

    @DeleteMapping(value="/{id}",version = "1.0")
    public ResponseEntity<ApiResponse<Void>> deleteBudget(@PathVariable("id") Integer id) {
        budgetService.deleteBudget(id);
        ApiResponse<Void> response = new ApiResponse<>(
                "Budget deleted successfully", null
        );
        return response.toResponseEntity();
    }
}
