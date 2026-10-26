package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.budget.BudgetDto;
import com.ksportfolio.expensetracker.dto.budget.BudgetFilter;
import com.ksportfolio.expensetracker.dto.budget.BudgetRequestDto;
import com.ksportfolio.expensetracker.dto.response.ApiPage;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.BudgetService;
import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping(version = "1.0")
    public ResponseEntity<ApiResponse<ApiPage<BudgetDto>>> getAllByUser(
        @Valid BudgetFilter budgetFilter,
        @PageableDefault(size = 20, sort = "modifiedAt", direction = Sort.Direction.DESC)
        Pageable pageable
    ) {
        ApiResponse<ApiPage<BudgetDto>> response = new ApiResponse<>(
        "Budgets retrieved successfully",
            budgetService.getAllByUser(budgetFilter,pageable)
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
        return response.toResponseEntity(HttpStatus.CREATED);
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
