package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.CategoryDto;
import com.ksportfolio.expensetracker.dto.CategoryRequestDto;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @PostMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Void>> addCategoryForUser(@RequestBody CategoryRequestDto categoryDto, @PathVariable Integer userId) {
        categoryService.addCategoryByUser(categoryDto, userId);
        ApiResponse<Void> response = new ApiResponse<>("Category added successfully", null);
        return response.toResponseEntity();
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<Void>> addCategory(@RequestBody CategoryRequestDto categoryDto) {
        categoryService.addCategory(categoryDto);
        ApiResponse<Void> response = new ApiResponse<>("Category added successfully", null);
        return response.toResponseEntity();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> editCategory(@RequestBody CategoryRequestDto categoryDto,@PathVariable Integer id) {
        categoryService.editCategory(categoryDto, id);
        ApiResponse<Void> response = new ApiResponse<>("Category edited successfully", null);
        return response.toResponseEntity();
    }

    @PutMapping("/user/{userId}/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> editCategoryForUser(@RequestBody CategoryRequestDto categoryDto,@PathVariable Integer id,@PathVariable Integer userId) {
        categoryService.editCategoryByUser(categoryDto, userId,id);
        ApiResponse<Void> response = new ApiResponse<>("Category edited successfully", null);
        return response.toResponseEntity();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        ApiResponse<Void> response = new ApiResponse<>("Category deleted successfully", null);
        return response.toResponseEntity();
    }

    @DeleteMapping("/user/{userId}/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategoryForUser(@PathVariable Integer id,@PathVariable Integer userId) {
        categoryService.deleteCategory(id, userId);
        ApiResponse<Void> response = new ApiResponse<>("Category deleted successfully", null);
        return response.toResponseEntity();
    }




}
