package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.CategoryDto;
import com.ksportfolio.expensetracker.dto.CategoryRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Category;

public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
        if (category == null) {
            return null;
        }
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        categoryDto.setDescription(category.getDescription());
        categoryDto.setIcon(category.getIcon());
        categoryDto.setIsIncome(category.getIsIncome());
        categoryDto.setIsUniversal(category.getIsUniversal());
        categoryDto.setIsActive(category.getIsActive());
        categoryDto.setUserId(category.getUser() != null ? category.getUser().getId() : null);
        categoryDto.setCreatedAt(category.getCreatedAt());
        categoryDto.setModifiedAt(category.getModifiedAt());
        return categoryDto;
    }

    public static Category toEntity(CategoryRequestDto categoryDto, AppUser appUser) {
        if (categoryDto == null) {
            return null;
        }
        Category category = new Category();
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setIcon(categoryDto.getIcon());
        category.setIsIncome(categoryDto.getIsIncome());
        category.setIsUniversal(categoryDto.getIsUniversal());
        category.setIsActive(categoryDto.getIsActive());
        category.setUser(appUser);
        return category;
    }

    public static Category toEntity(CategoryRequestDto categoryDto, AppUser appUser, Category category) {
        if (categoryDto == null) {
            return null;
        }
        category.setName(categoryDto.getName());
        category.setDescription(categoryDto.getDescription());
        category.setIcon(categoryDto.getIcon());
        category.setIsIncome(categoryDto.getIsIncome());
        category.setIsUniversal(categoryDto.getIsUniversal());
        category.setIsActive(categoryDto.getIsActive());
        category.setUser(appUser);
        return category;
    }
}
