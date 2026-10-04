package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.Budget.BudgetDto;
import com.ksportfolio.expensetracker.dto.Budget.BudgetFilter;
import com.ksportfolio.expensetracker.dto.Budget.BudgetRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Budget;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.BudgetMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.BudgetRepo;
import com.ksportfolio.expensetracker.repository.CategoryRepo;
import com.ksportfolio.expensetracker.utility.DBUtility;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepo budgetRepo;
    private final CategoryRepo categoryRepo;
    private final AppUserRepo appUserRepo;
    private final AppContextService appContextService;

    public BudgetDto getById(Integer id) {
        Integer userId =  appContextService.getUserId();
        return BudgetMapper.toDto(getOwned(id,userId));
    }

    public List<BudgetDto> getByUser(BudgetFilter filter) {
        List<Budget> budgets = budgetRepo.findAll(buildSpecification(filter));
        return budgets.stream().map(BudgetMapper::toDto).toList();
    }

    @Transactional
    public void addBudget(BudgetRequestDto request) {
        Integer userId =  appContextService.getUserId();
        Category category = getCategoryForBudget(request.getCategory(), userId);
        AppUser user =  appUserRepo.getReferenceById(userId);
        boolean isExist = budgetRepo.existsByDurationTypeAndCategoryIdAndUserId(request.getDurationType(),request.getCategory(),userId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.BUDGET_EXISTS,category.getName(),request.getDurationType());
        }
        Budget budget = BudgetMapper.toEntity(request, user, category);
        budgetRepo.save(budget);
    }

    @Transactional
    public void updateBudget(BudgetRequestDto request, Integer budgetId) {
        Integer userId =  appContextService.getUserId();
        Budget budget = getOwned(budgetId, userId);
        Category category = getCategoryForBudget(request.getCategory(), userId);
        boolean isExist = budgetRepo.existsByDurationTypeAndCategoryIdAndUserIdAndIdNot(request.getDurationType(),request.getCategory(),userId,budgetId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.BUDGET_EXISTS,category.getName(),request.getDurationType());
        }
        BudgetMapper.updateEntity(request,budget,category);
        budgetRepo.save(budget);
    }

    @Transactional
    public void deleteBudget(Integer budgetId) {
        Integer userId =  appContextService.getUserId();
        int count = budgetRepo.deleteOwned(budgetId,userId);
        if (count == 0) {
            throw new BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,budgetId);
        }
    }

    private Budget getOwned(Integer id,Integer userId) {
        return budgetRepo.findByUserIdAndId(userId,id).orElseThrow(
            ()->new  BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,id)
        );
    }

    private Category getCategoryForBudget(Integer categoryId, Integer userId) {
        Category category = categoryRepo.findVisibleToUser(categoryId,userId).orElseThrow(
                ()->new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,categoryId)
        );

        if (Boolean.TRUE.equals(category.getIsIncome())) {
            throw new BusinessLogicException(ErrorCode.BUDGET_CANT_SET_FOR_INCOME, categoryId);
        }
        return category;
    }

    private Specification<Budget> buildSpecification(BudgetFilter filter) {
        Integer userId = Objects.requireNonNull(filter.getUserId(), "userId is required");

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // mandatory: b.user.id = :userId (always applied)
            predicates.add(cb.equal(root.get("user").get("id"), userId));

            // optional: b.durationType = :durationType
            if (filter.getDurationType() != null) {
                predicates.add(cb.equal(root.get("durationType"), filter.getDurationType()));
            }

            // optional: search on category name or description
            if (filter.getSearchText() != null && !filter.getSearchText().isBlank()) {
                Join<Budget, Category> category = root.join("category", JoinType.INNER);
                String pattern = "%" + DBUtility.escapeLike(filter.getSearchText().trim().toLowerCase()) + "%";

                predicates.add(cb.or(
                        cb.like(cb.lower(category.get("name")), pattern, '\\'),
                        cb.like(cb.lower(category.get("description")), pattern, '\\')
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
