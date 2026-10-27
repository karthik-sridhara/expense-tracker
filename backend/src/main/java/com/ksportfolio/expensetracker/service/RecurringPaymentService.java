package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.recurringpayment.RecurringPaymentDto;
import com.ksportfolio.expensetracker.dto.recurringpayment.RecurringPaymentFilter;
import com.ksportfolio.expensetracker.dto.recurringpayment.RecurringPaymentRequestDto;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.entity.RecurringPayment;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.RecurringPaymentMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.CategoryRepo;
import com.ksportfolio.expensetracker.repository.RecurringPaymentRepo;
import com.ksportfolio.expensetracker.utility.DBUtility;
import com.ksportfolio.expensetracker.dto.response.ApiPage;
import com.ksportfolio.expensetracker.mapper.PageMapper;
import com.ksportfolio.expensetracker.utility.PaginationUtility;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecurringPaymentService {

    private static final Set<String> SORTABLE = Set.of("name", "amount", "recurring", "endDate", "createdAt", "modifiedAt");

    private final RecurringPaymentRepo recurringPaymentRepo;
    private final AppUserRepo appUserRepo;
    private final CategoryRepo categoryRepo;

    public ApiPage<RecurringPaymentDto> getAllByUser(RecurringPaymentFilter filter, Pageable pageable) {
        PaginationUtility.validateSort(pageable, SORTABLE);
        Page<RecurringPaymentDto> page = recurringPaymentRepo.findAll(buildSpec(filter), pageable)
                .map(RecurringPaymentMapper::toDto);
        return PageMapper.toDto(page);
    }

    public RecurringPaymentDto getByUser(Integer id, Integer userId) {
        return RecurringPaymentMapper.toDto(getOwned(id, userId));
    }

    @Transactional
    public RecurringPaymentDto create(Integer userId, RecurringPaymentRequestDto request) {
        RecurringPayment payment = new RecurringPayment();
        payment.setUser(appUserRepo.getReferenceById(userId));
        payment.setActive(true);
        applyRequest(payment, request, userId);
        return RecurringPaymentMapper.toDto(recurringPaymentRepo.save(payment));
    }

    @Transactional
    public RecurringPaymentDto update(Integer userId, Integer id, RecurringPaymentRequestDto request) {
        RecurringPayment payment = getOwned(id, userId);
        applyRequest(payment, request, userId);
        return RecurringPaymentMapper.toDto(recurringPaymentRepo.save(payment));
    }

    @Transactional
    public RecurringPaymentDto pause(Integer userId, Integer id) {
        RecurringPayment payment = getOwned(id, userId);
        payment.setActive(false);
        return RecurringPaymentMapper.toDto(recurringPaymentRepo.save(payment));
    }

    @Transactional
    public RecurringPaymentDto resume(Integer userId, Integer id) {
        RecurringPayment payment = getOwned(id, userId);
        if (payment.getEndDate() != null && payment.getEndDate().isBefore(LocalDate.now())) {
            throw new BusinessLogicException(ErrorCode.INVALID_RECURRING_SCHEDULE,
                    "end date has already passed; update the end date before resuming");
        }
        payment.setActive(true);
        return RecurringPaymentMapper.toDto(recurringPaymentRepo.save(payment));
    }

    @Transactional
    public void delete(Integer userId, Integer id) {
        recurringPaymentRepo.delete(getOwned(id, userId));
    }

    // ---------- helpers ----------

    private RecurringPayment getOwned(Integer id, Integer userId) {
        return recurringPaymentRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.RECURRING_PAYMENT_NOT_FOUND, id));
    }

    private void applyRequest(RecurringPayment payment, RecurringPaymentRequestDto request, Integer userId) {
        validateSchedule(request);
        Category category = categoryRepo.findVisibleToUser(request.getCategory(), userId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND, request.getCategory()));

        payment.setName(request.getName().trim());
        payment.setDescription(request.getDescription());
        payment.setRecurring(request.getRecurring());
        payment.setDay(request.getDay());
        payment.setMonth(request.getMonth());
        payment.setAmount(request.getAmount());
        payment.setCategory(category);
        payment.setEndDate(request.getEndDate());
    }

    /** day/month semantics: DAILY none, WEEKLY day=1..7, MONTHLY day=1..31, YEARLY day+month. */
    private void validateSchedule(RecurringPaymentRequestDto r) {
        Integer day = r.getDay();
        Integer month = r.getMonth();
        switch (r.getRecurring()) {
            case DAILY -> {
                if (day != null || month != null) fail("daily payments must not have day or month");
            }
            case WEEKLY -> {
                if (day == null || day > 7 || month != null) fail("weekly payments require day of week (1-7) and no month");
            }
            case MONTHLY -> {
                if (day == null || month != null) fail("monthly payments require day of month and no month");
            }
            case YEARLY -> {
                if (day == null || month == null) fail("yearly payments require both day and month");
            }
        }
        if (r.getEndDate() != null && r.getEndDate().isBefore(LocalDate.now())) {
            fail("end date cannot be in the past");
        }
    }

    private void fail(String reason) {
        throw new BusinessLogicException(ErrorCode.INVALID_RECURRING_SCHEDULE, reason);
    }

    private Specification<RecurringPayment> buildSpec(RecurringPaymentFilter filter) {
        Integer userId = Objects.requireNonNull(filter.appGetUser(), "userId is required");

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
                predicates.add(cb.equal(root.get("category").get("id"),filter.getCategory()));
            }
            if (filter.getRecurring() != null) {
                predicates.add(cb.equal(root.get("recurring"), filter.getRecurring()));
            }
            if (filter.getActive() != null) {
                predicates.add(cb.equal(root.get("active"), filter.getActive()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
