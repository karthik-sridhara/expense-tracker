package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.apptransaction.AppTransactionDto;
import com.ksportfolio.expensetracker.dto.apptransaction.AppTransactionFilter;
import com.ksportfolio.expensetracker.dto.apptransaction.AppTransactionRequestDto;
import com.ksportfolio.expensetracker.entity.AppTransaction;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.AppTransactionMapper;
import com.ksportfolio.expensetracker.repository.AppTransactionRepo;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
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
@Transactional(readOnly=true)
@RequiredArgsConstructor
public class AppTransactionService {

    private final AppTransactionRepo appTransactionRepo;
    private final AppUserRepo appUserRepo;
    private final CategoryRepo categoryRepo;

    public List<AppTransactionDto> fetchAll(AppTransactionFilter filter) {
        List<AppTransaction> result = appTransactionRepo.findAll(findAllFilter(filter));
        return result.stream().map(AppTransactionMapper::toDto).toList();
    }

    public AppTransactionDto fetchOne(int id,int userId ) {
        return AppTransactionMapper.toDto(getOwned(userId,id));
    }

    @Transactional
    public AppTransactionDto create(Integer userId, AppTransactionRequestDto request) {
        AppTransaction transaction = new AppTransaction();
        transaction.setUser(appUserRepo.getReferenceById(userId));
        applyRequest(transaction, request);
        return AppTransactionMapper.toDtoWithUser(appTransactionRepo.save(transaction));
    }

    @Transactional
    public AppTransactionDto update(Integer userId, Integer id, AppTransactionRequestDto request) {
        AppTransaction transaction = getOwned(userId, id);
        applyRequest(transaction, request);
        return AppTransactionMapper.toDtoWithUser(appTransactionRepo.save(transaction));
    }

    @Transactional
    public void delete(Integer userId, Integer id) {
        appTransactionRepo.delete(getOwned(userId, id));
    }

    private AppTransaction getOwned(Integer userId, Integer id) {
        return appTransactionRepo.findByIdAndUserId(id,userId).orElseThrow(
                () -> new BusinessLogicException(ErrorCode.NO_TRANSACTION_FOUND)
        );
    }

    private void applyRequest(AppTransaction transaction, AppTransactionRequestDto request) {
        Category category = categoryRepo.findVisibleToUser(request.getCategory(),transaction.getUser().getId()).
                orElseThrow(() -> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND, request.getCategory()));
        transaction.setName(request.getName().trim());
        transaction.setDescription(request.getDescription());
        transaction.setCategory(category);
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
    }

    private Specification<AppTransaction> findAllFilter(AppTransactionFilter filter) {
        Integer userId = Objects.requireNonNull(filter.getCurrentlyLoggedInUser(), "userId is required");

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (filter.getSearchText() != null && !filter.getSearchText().isBlank()) {
                String pattern = "%" + DBUtility.escapeLike(filter.getSearchText().trim().toLowerCase()) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern, '\\'),
                        cb.like(cb.lower(root.get("description")), pattern, '\\')
                ));
            }

            if (filter.getCategory() != null) {
                // no join needed: category_id is a column on the transaction table
                predicates.add(cb.equal(root.get("category").get("id"), filter.getCategory()));
            } else if (filter.getIncome() != null) {
                Join<AppTransaction, Category> category = root.join("category", JoinType.INNER);
                predicates.add(cb.equal(category.get("isIncome"), filter.getIncome()));
            }

            if (filter.getFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("transactionDate"), filter.getFrom()));
            }
            if (filter.getTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("transactionDate"), filter.getTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

}
