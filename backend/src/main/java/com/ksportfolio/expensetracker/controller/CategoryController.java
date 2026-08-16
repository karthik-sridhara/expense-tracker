package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.CategoryDto;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping()
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        ApiResponse<List<CategoryDto>> response =  new ApiResponse<List<CategoryDto>>(
                "Categories retrieved successfully",
                categoryService.getAll()
        );
        return response.toResponseEntity();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategoriesForUser(@PathVariable Integer userId) {
        ApiResponse<List<CategoryDto>> response =  new ApiResponse<List<CategoryDto>>(
                "Categories retrieved successfully",
                categoryService.getAllByUser(userId)
        );
        return response.toResponseEntity();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryById(@PathVariable Integer id) {
        ApiResponse<CategoryDto> response =  new ApiResponse<CategoryDto>(
                "Category retrieved successfully",
                categoryService.getById(id)
        );
        return response.toResponseEntity();
    }



}
