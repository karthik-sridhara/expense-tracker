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
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetService {

    private final BudgetRepo budgetRepo;
    private final CategoryRepo categoryRepo;
    private final AppUserRepo appUserRepo;
    private final AppContextService appContextService;

    public List<BudgetDto> getAll() {
        List<Budget> budgets = budgetRepo.findAll();
        List<BudgetDto> budgetDtos = new ArrayList<>();
        for (Budget budget : budgets) {
            budgetDtos.add(BudgetMapper.toDto(budget));
        }
        return budgetDtos;
    }

    public BudgetDto getById(Integer id) {
        Integer userId = appContextService.getUserId();
        Optional<Budget> budget = budgetRepo.findByUserIdAndId(userId,id);
        return budget.map(BudgetMapper::toDto).orElseThrow(
                ()->new BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,id)
        );
    }

    public List<BudgetDto> getByUser(BudgetFilter filter) {
        Integer userId = appContextService.getUserId();
        filter.setUserId(userId);
        List<Budget> budgets = budgetRepo.findAll(buildSpecification(filter));
        List<BudgetDto> budgetDtos = new ArrayList<>();
        for (Budget budget : budgets) {
            budgetDtos.add(BudgetMapper.toDto(budget));
        }
        return budgetDtos;
    }

    @Transactional
    public void addBudget(BudgetRequestDto request) {
        Integer userId =  appContextService.getUserId();
        Category category = categoryRepo.findById(request.getCategory()).orElseThrow(
                ()->new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,request.getCategory())
        );
        if(!category.getIsUniversal() && !category.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND, request.getCategory());
        }
        AppUser user =  appUserRepo.getReferenceById(userId);
        boolean isExist = budgetRepo.existsByDurationTypeAndCategoryIdAndUserId(request.getDurationType(),request.getCategory(),userId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.BUDGET_EXISTS,request.getCategory(),request.getDurationType());
        }
        Budget budget = BudgetMapper.toEntity(request, user, category);
        budgetRepo.save(budget);
    }

    @Transactional
    public void updateBudget(BudgetRequestDto request, Integer budgetId) {
        Integer userId =  appContextService.getUserId();
        Budget budget = budgetRepo.findById(budgetId).orElseThrow(
                ()->new  BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,budgetId)
        );

        if(!budget.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }

        Category category = categoryRepo.findById(request.getCategory()).orElseThrow(
                ()->new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND,request.getCategory())
        );

        if(!category.getIsUniversal() && !category.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND, request.getCategory());
        }

        boolean isExist = budgetRepo.existsByDurationTypeAndCategoryIdAndUserIdAndIdNot(request.getDurationType(),request.getCategory(),userId,budgetId);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.BUDGET_EXISTS,request.getCategory(),request.getDurationType());
        }
        BudgetMapper.toEntity(request,budget,category);
        budgetRepo.save(budget);
    }

    @Transactional
    public void deleteBudget(Integer budgetId) {
        Integer userId =  appContextService.getUserId();
        Budget budget = budgetRepo.findById(budgetId).orElseThrow(
                ()->new  BusinessLogicException(ErrorCode.BUDGET_NOT_FOUND,budgetId)
        );

        if(!budget.getUser().getId().equals(userId)) {
            throw new BusinessLogicException(ErrorCode.ACCESS_DENIED);
        }
        budgetRepo.delete(budget);
    }

    private Specification<Budget> buildSpecification(BudgetFilter filter) {

        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            /*
             * Equivalent to:
             * JOIN FETCH b.category c
             *
             * Fetch category only for the main entity query.
             * This avoids issues when Spring executes a count query
             * for pagination.
             */
            if (query.getResultType() != Long.class
                    && query.getResultType() != long.class) {

                root.fetch("category", JoinType.INNER);
            }

            /*
             * Creates a normal join so that category fields
             * can be used in WHERE conditions.
             */
            Join<Budget, Category> categoryJoin =
                    root.join("category", JoinType.INNER);

            /*
             * Mandatory filter:
             * b.user.id = :userId
             */
            predicates.add(
                    criteriaBuilder.equal(
                            root.get("user").get("id"),
                            filter.getUserId()
                    )
            );

            /*
             * Optional filter:
             * c.dynamicType = :dynamicType
             *
             * If dynamicType is null, this predicate is not added.
             */
            if (filter.getDurationType() != null) {
                predicates.add(
                        criteriaBuilder.equal(
                                root.get("durationType"),
                                filter.getDurationType()
                        )
                );
            }

            query.distinct(true);

            return criteriaBuilder.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }

}
