package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Payment;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Integer>,JpaSpecificationExecutor<Payment> {

    @EntityGraph(attributePaths = {"category", "transaction"})
    Optional<Payment> findByIdAndUserId(Integer id, Integer userId);

    @EntityGraph(attributePaths = "category")
    List<Payment> findAll(Specification<Payment> spec);

    @Override
    @EntityGraph(attributePaths = "category")
    Page<Payment> findAll(Specification<Payment> spec, Pageable pageable);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @EntityGraph(attributePaths = {"category", "transaction"})
    @Query("select p from Payment p where p.id = :id and p.user.id = :userId")
    Optional<Payment> findByIdAndUserIdForUpdate(
        @Param("id") Integer id,
        @Param("userId") Integer userId
    );

    boolean existsByRecurringPaymentIdAndDueDate(Integer recurringPaymentId, LocalDate dueDate);

    /** Removes generated payments that are not yet completed, from a date onwards (used when a schedule changes). */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
        delete from Payment p
        where p.recurringPayment.id = :recurringPaymentId
          and p.transaction is null
          and p.dueDate >= :fromDate
        """)
    int deleteUncompletedGenerated(@Param("recurringPaymentId") Integer recurringPaymentId,
                                   @Param("fromDate") LocalDate fromDate);

    /** Detaches generated payments from a schedule so they survive as history when it is deleted. */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update Payment p set p.recurringPayment = null where p.recurringPayment.id = :recurringPaymentId")
    int detachFromRecurring(@Param("recurringPaymentId") Integer recurringPaymentId);

}