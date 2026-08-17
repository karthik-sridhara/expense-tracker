package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.CategoryDto;
import com.ksportfolio.expensetracker.dto.CategoryRequestDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getAll();
    List<CategoryDto> getAllByUser(Integer userId);
    CategoryDto getById(Integer id);
    void addCategoryByUser(CategoryRequestDto dto,Integer userId);
    void addCategory(CategoryRequestDto dto);
    void editCategoryByUser(CategoryRequestDto dto,Integer userId,Integer categoryId);
    void editCategory(CategoryRequestDto dto, Integer categoryId);
    void deleteCategory(Integer categoryId);
    void deleteCategory(Integer categoryId, Integer userId);
}
