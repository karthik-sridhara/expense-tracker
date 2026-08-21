package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.CategoryDto;
import com.ksportfolio.expensetracker.dto.CategoryRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.CategoryMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.CategoryRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final AppContextService appContextService;
    private final CategoryRepo  categoryRepo;
    private final AppUserRepo appUserRepo;

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
    }

    public List<CategoryDto> getAllByUser() {
        Integer userId = appContextService.getUserId();
        List<Category> categories = categoryRepo.findByUserIdOrIsUniversal(userId,true);
        List<CategoryDto> categoryDtos = new ArrayList<>();
        for (Category category : categories) {
            categoryDtos.add(CategoryMapper.toDto(category));
        }
        return categoryDtos;
    }

    @Transactional
    public void addUserCategory(CategoryRequestDto dto) {
        Integer userId = appContextService.getUserId();
        boolean isExist = categoryRepo.existsByUserIdAndName(userId, dto.getName());
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_ALREADY_EXIST,dto.getName());
        }
        AppUser appUser = appUserRepo.getReferenceById(userId);
        dto.setIsUniversal(false);
        dto.setIsActive(true);
        Category category = CategoryMapper.toEntity(dto, appUser);
        categoryRepo.save(category);
    }

    @Transactional
    public void addCategory(CategoryRequestDto dto) {
        boolean isExist = categoryRepo.existsByNameAndIsUniversal(dto.getName(),true);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_ALREADY_EXIST,dto.getName());
        }
        dto.setIsUniversal(true);
        dto.setIsActive(true);
        Category category = CategoryMapper.toEntity(dto, null);
        categoryRepo.save(category);
    }

    @Transactional
    public void editUserCategory(CategoryRequestDto dto,Integer categoryId) {
        Integer userId = appContextService.getUserId();
        Category category = categoryRepo.findById(categoryId).orElseThrow(
                ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,categoryId)
        );
        if(category.getIsUniversal()||category.getUser() == null || !category.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }
        boolean isExist = categoryRepo.existsByUserIdAndNameAndIdNot(userId, dto.getName(), categoryId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_ALREADY_EXIST,dto.getName());
        }
        dto.setIsUniversal(false);
        AppUser appUser = appUserRepo.getReferenceById(userId);
        CategoryMapper.toEntity(dto, appUser, category);
        categoryRepo.save(category);
    }

    @Transactional
    public void editCategory(CategoryRequestDto dto,Integer categoryId) {
        Category category = categoryRepo.findById(categoryId).orElseThrow(
                ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,categoryId)
        );
        if(!category.getIsUniversal()) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }
        boolean isExist = categoryRepo.existsByNameAndIsUniversalAndIdNot(dto.getName(),true,categoryId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_ALREADY_EXIST,dto.getName());
        }
        dto.setIsUniversal(true);
        CategoryMapper.toEntity(dto, null, category);
        categoryRepo.save(category);
    }

    @Transactional
    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepo.findById(categoryId).orElseThrow(
                ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,categoryId)
        );
        if(!category.getIsUniversal()) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }
        categoryRepo.delete(category);
    }

    @Transactional
    public void deleteUserCategory(Integer categoryId) {
        Integer userId = appContextService.getUserId();
        Category category = categoryRepo.findById(categoryId).orElseThrow(
                ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,categoryId)
        );
        if(category.getIsUniversal() || category.getUser() == null || !category.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }
        categoryRepo.delete(category);
    }

}
