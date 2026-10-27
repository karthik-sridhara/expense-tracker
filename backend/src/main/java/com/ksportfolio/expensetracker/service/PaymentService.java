package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.constant.MessageCode;
import com.ksportfolio.expensetracker.dto.payment.PaymentDto;
import com.ksportfolio.expensetracker.dto.payment.PaymentFilter;
import com.ksportfolio.expensetracker.dto.payment.PaymentRequestDto;
import com.ksportfolio.expensetracker.dto.response.ApiMessage;
import com.ksportfolio.expensetracker.entity.AppTransaction;
import com.ksportfolio.expensetracker.entity.Category;
import com.ksportfolio.expensetracker.entity.Payment;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.PaymentMapper;
import com.ksportfolio.expensetracker.repository.AppTransactionRepo;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.CategoryRepo;
import com.ksportfolio.expensetracker.repository.PaymentRepo;
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

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private static final Set<String> SORTABLE = Set.of("name", "amount", "dueDate", "createdAt", "modifiedAt");

    private final PaymentRepo paymentRepo;
    private final CategoryRepo categoryRepo;
    private final AppUserRepo appUserRepo;
    private final AppTransactionRepo transactionRepo;
    private final AppContextService appContextService;

    public ApiPage<PaymentDto> getAll(PaymentFilter filter, Pageable pageable) {
        PaginationUtility.validateSort(pageable, SORTABLE);
        filter.appSetUser(appContextService.getUserId());   // never trust the client for this
        Page<PaymentDto> page = paymentRepo.findAll(withFilter(filter), pageable)
                .map(PaymentMapper::toDto);
        return PageMapper.toDto(page);
    }

    public PaymentDto getByIdAndUserId(Integer id) {
        return PaymentMapper.toDto(getOwned(id, appContextService.getUserId()));
    }

    @Transactional
    public void create(PaymentRequestDto request) {
        Integer userId = appContextService.getUserId();
        Payment payment = new Payment();
        payment.setUser(appUserRepo.getReferenceById(userId));
        apply(payment, request, userId);
        paymentRepo.save(payment);
    }

    @Transactional
    public void update(Integer id, PaymentRequestDto request) {
        Integer userId = appContextService.getUserId();
        Payment payment = getOwned(id, userId);
        if(payment.getTransaction()!=null) {
            throw new BusinessLogicException(ErrorCode.CANNOT_UPDATE_PAYMENT);
        }
        apply(payment, request, userId);
        paymentRepo.save(payment);
    }

    @Transactional
    public ApiMessage delete(Integer id) {
        Payment payment = getOwned(id, appContextService.getUserId());
        AppTransaction tx = payment.getTransaction();
        paymentRepo.delete(payment);
        if(tx != null) {
            paymentRepo.flush();
            ApiMessage message = new ApiMessage(
                MessageCode.DELETED_PAYMENT_LINKED_TRANSACTION.getCode(),
                MessageCode.DELETED_PAYMENT_LINKED_TRANSACTION.formatMessage(tx.getName())
            );
            transactionRepo.delete(tx);
            return message;
        }
        return null;
    }

    @Transactional
    public void complete(Integer id, Instant transactionDate) {
        Integer userId = appContextService.getUserId();
        Payment payment = getOwned(id, userId);
        if (payment.getTransaction() != null) {
            throw new BusinessLogicException(ErrorCode.PAYMENT_ALREADY_COMPLETED, id);
        }
        AppTransaction tx = new AppTransaction();
        tx.setName(payment.getName());
        tx.setDescription(payment.getDescription());
        tx.setCategory(payment.getCategory());
        tx.setAmount(payment.getAmount());
        tx.setTransactionDate(transactionDate);
        tx.setUser(appUserRepo.getReferenceById(userId));
        tx = transactionRepo.save(tx);
        payment.setTransaction(tx);
        paymentRepo.save(payment);
    }

    private Payment getOwned(Integer id, Integer userId) {
        return paymentRepo.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.PAYMENT_NOT_FOUND, id));
    }

    private void apply(Payment p, PaymentRequestDto r, Integer userId) {
        Category category = categoryRepo.findVisibleToUser(r.categoryId(), userId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.CATEGORY_NOT_FOUND, r.categoryId()));
        p.setName(r.name());
        p.setDescription(r.description());
        p.setCategory(category);
        p.setDueDate(r.dueDate());
        p.setAmount(r.amount());
    }

    public static Specification<Payment> withFilter(PaymentFilter f) {
        Integer userId = Objects.requireNonNull(f.appGetUser(), "userId is required");

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (f.getSearchText() != null && !f.getSearchText().isBlank()) {
                String pattern = "%" + DBUtility.escapeLike(f.getSearchText().trim().toLowerCase()) + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), pattern, '\\'),
                        cb.like(cb.lower(root.get("description")), pattern, '\\')
                ));
            }

            if (f.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), f.getCategoryId()));
            }

            if (f.getCompleted() != null) {
                predicates.add(f.getCompleted()
                        ? cb.isNotNull(root.get("transaction"))
                        : cb.isNull(root.get("transaction")));
            }

            if (f.getDueFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("dueDate"), f.getDueFrom()));
            }
            if (f.getDueTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("dueDate"), f.getDueTo()));
            }

            if (f.getMinAmount() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), f.getMinAmount()));
            }
            if (f.getMaxAmount() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), f.getMaxAmount()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }


}
