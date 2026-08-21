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

    @GetMapping(value="/admin",version = "1.0")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategories() {
        ApiResponse<List<CategoryDto>> response =  new ApiResponse<List<CategoryDto>>(
                "Categories retrieved successfully",
                categoryService.getAll()
        );
        return response.toResponseEntity();
    }

    @GetMapping(version = "1.0")
    public ResponseEntity<ApiResponse<List<CategoryDto>>> getCategoriesForUser() {
        ApiResponse<List<CategoryDto>> response =  new ApiResponse<List<CategoryDto>>(
                "Categories retrieved successfully",
                categoryService.getAllByUser()
        );
        return response.toResponseEntity();
    }

    @GetMapping(value = "/{id}",version = "1.0")
    public ResponseEntity<ApiResponse<CategoryDto>> getCategoryById(@PathVariable Integer id) {
        ApiResponse<CategoryDto> response =  new ApiResponse<CategoryDto>(
                "Category retrieved successfully",
                categoryService.getById(id)
        );
        return response.toResponseEntity();
    }

    @PostMapping(version = "1.0",value = "/admin")
    public ResponseEntity<ApiResponse<Void>> addCategory(@RequestBody CategoryRequestDto categoryDto) {
        categoryService.addCategory(categoryDto);
        ApiResponse<Void> response = new ApiResponse<>("Category added successfully", null);
        return response.toResponseEntity();
    }

    @PutMapping(version = "1.0",value = "/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> editCategory(@RequestBody CategoryRequestDto categoryDto,@PathVariable Integer id) {
        categoryService.editCategory(categoryDto, id);
        ApiResponse<Void> response = new ApiResponse<>("Category edited successfully", null);
        return response.toResponseEntity();
    }

    @DeleteMapping(version = "1.0",value = "/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer id) {
        categoryService.deleteCategory(id);
        ApiResponse<Void> response = new ApiResponse<>("Category deleted successfully", null);
        return response.toResponseEntity();
    }

    @PostMapping(version = "1.0")
    public ResponseEntity<ApiResponse<Void>> addUserCategory(@RequestBody CategoryRequestDto categoryDto) {
        categoryService.addUserCategory(categoryDto);
        ApiResponse<Void> response = new ApiResponse<>("Category added successfully", null);
        return response.toResponseEntity();
    }

    @PutMapping(version = "1.0",value = "/{id}")
    public ResponseEntity<ApiResponse<Void>> editUserCategory(@RequestBody CategoryRequestDto categoryDto,@PathVariable Integer id) {
        categoryService.editUserCategory(categoryDto,id);
        ApiResponse<Void> response = new ApiResponse<>("Category edited successfully", null);
        return response.toResponseEntity();
    }

    @DeleteMapping(version = "1.0",value = "/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUserCategory(@PathVariable Integer id) {
        categoryService.deleteUserCategory(id);
        ApiResponse<Void> response = new ApiResponse<>("Category deleted successfully", null);
        return response.toResponseEntity();
    }

}
