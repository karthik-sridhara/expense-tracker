package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.RecurringPayment;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringPaymentRepo extends JpaRepository<RecurringPayment, Integer>,
        JpaSpecificationExecutor<RecurringPayment> {

    @EntityGraph(attributePaths = "category")
    List<RecurringPayment> findAll(Specification<RecurringPayment> spec);

    @EntityGraph(attributePaths = "category")
    Optional<RecurringPayment> findByIdAndUserId(Integer id, Integer userId);
}
