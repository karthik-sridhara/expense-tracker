package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.category.CategoryDto;
import com.ksportfolio.expensetracker.dto.category.CategoryFilter;
import com.ksportfolio.expensetracker.dto.category.CategoryRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.CategoryMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.CategoryRepo;
import com.ksportfolio.expensetracker.utility.DBUtility;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
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

    public CategoryDto getById(Integer id) {
        Category category = categoryRepo.findById(id).orElseThrow(
            ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,id)
        );
        return CategoryMapper.toDto(category);
    }

    public CategoryDto getUserCategoryById(Integer id) {
        Integer userId = appContextService.getUserId();
        Category category = getOwnedCategory(id, userId);
        return CategoryMapper.toDto(category);
    }

    public List<CategoryDto> getAllByUser(CategoryFilter categoryFilter) {
        categoryFilter.setUserId(appContextService.getUserId());
        List<Category> categories = categoryRepo.findAll(filter(categoryFilter));
        return categories.stream().map(CategoryMapper::toDto).toList();
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
    public void addUniversalCategory(CategoryRequestDto dto) {
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
        Category category = getOwnedCategory(categoryId, userId);
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
    public void editUniversalCategory(CategoryRequestDto dto, Integer categoryId) {
        Category category = getUniversalCategory(categoryId);
        boolean isExist = categoryRepo.existsByNameAndIsUniversalAndIdNot(dto.getName(),true,categoryId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_ALREADY_EXIST,dto.getName());
        }
        dto.setIsUniversal(true);
        CategoryMapper.toEntity(dto, null, category);
        categoryRepo.save(category);
    }

    @Transactional
    public void deleteUniversalCategory(Integer categoryId) {
        Category category = getUniversalCategory(categoryId);
        categoryRepo.delete(category);
    }

    @Transactional
    public void deleteUserCategory(Integer categoryId) {
        Integer userId = appContextService.getUserId();
        Category category = getOwnedCategory(categoryId, userId);
        categoryRepo.delete(category);
    }

    private Category getOwnedCategory(Integer categoryId, Integer userId) {
        return categoryRepo.findByIdAndUserId(categoryId,userId).orElseThrow(
            ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,categoryId)
        );
    }

    private Category getUniversalCategory(Integer categoryId) {
        return categoryRepo.findUniversal(categoryId).orElseThrow(
            ()-> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,categoryId)
        );
    }

    private static Specification<Category> filter(CategoryFilter filter) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (filter.getUserId() != null) {
                predicates.add(
                    criteriaBuilder.or(
                        criteriaBuilder.equal(root.get("user").get("id"), filter.getUserId()),
                        criteriaBuilder.isTrue(root.get("isUniversal"))
                    )
                );
            }

            if (filter.getIsIncome() != null) {
                predicates.add(
                    criteriaBuilder.equal(root.get("isIncome"),filter.getIsIncome())
                );
            }

            if (filter.getIsActive() != null) {
                predicates.add(
                    criteriaBuilder.equal(root.get("isActive"), filter.getIsActive())
                );
            }

            if (filter.getUniversal() != null) {
                predicates.add(
                    criteriaBuilder.equal(root.get("isUniversal"), filter.getUniversal())
                );
            }

            String searchText = filter.getSearchText();

            if(searchText != null && !searchText.isBlank()) {
                String pattern = "%" + DBUtility.escapeLike(searchText.trim().toLowerCase()) + "%";
                predicates.add(criteriaBuilder.or(
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), pattern, '\\'),
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), pattern, '\\')
                ));
            }
            return criteriaBuilder.and(
                predicates.toArray(new Predicate[0])
            );
        };
    }

}
