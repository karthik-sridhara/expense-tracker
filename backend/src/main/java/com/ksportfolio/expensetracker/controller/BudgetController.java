package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.Budget.BudgetDto;
import com.ksportfolio.expensetracker.dto.Budget.BudgetFilter;
import com.ksportfolio.expensetracker.dto.Budget.BudgetRequestDto;
import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.BudgetService;
import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping(version = "1.0")
    public ResponseEntity<ApiResponse<List<BudgetDto>>> getAllByUserId(
        @AuthenticationPrincipal AppUserDetails user,
        @RequestParam(required = false) DurationType durationType,
        @RequestParam(required = false) String searchText
    ) {
        BudgetFilter budgetFilter = new BudgetFilter();
        budgetFilter.setDurationType(durationType);
        budgetFilter.setSearchText(searchText);
        budgetFilter.setUserId(user.getUserId());
        ApiResponse<List<BudgetDto>> response = new ApiResponse<>(
        "Budgets retrieved successfully",
                budgetService.getByUser(budgetFilter)
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
