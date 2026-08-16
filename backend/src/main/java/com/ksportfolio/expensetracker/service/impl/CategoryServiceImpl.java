package com.ksportfolio.expensetracker.service.impl;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.CategoryDto;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.CategoryMapper;
import com.ksportfolio.expensetracker.repository.CategoryRepo;
import com.ksportfolio.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepo  categoryRepo;

    public List<CategoryDto> getAll() {
        List<Category> categories = categoryRepo.findAll();
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (Category category : categories) {
            categoryDtos.add(CategoryMapper.toDto(category));
        }
        return categoryDtos;
    }

    public CategoryDto getById(Integer id) {
        Category category = categoryRepo.findById(id).orElseThrow(
                ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,id)
        );
        return CategoryMapper.toDto(category);
    };

    public List<CategoryDto> getAllByUser(Integer userId) {
        List<Category> categories = categoryRepo.getAllByUser(userId);
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (Category category : categories) {
            categoryDtos.add(CategoryMapper.toDto(category));
        }
        return categoryDtos;
    }


}
