package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

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

}