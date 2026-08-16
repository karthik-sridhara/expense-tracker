package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.CategoryDto;

import java.util.List;

public interface CategoryService {

    List<CategoryDto> getAll();
    List<CategoryDto> getAllByUser(Integer userId);
    CategoryDto getById(Integer id);

}
