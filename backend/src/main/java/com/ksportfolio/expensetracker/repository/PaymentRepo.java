package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Payment;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Integer>,JpaSpecificationExecutor<Payment> {

    @EntityGraph(attributePaths = {"category", "transaction"})
    Optional<Payment> findByIdAndUserId(Integer id, Integer userId);

    @EntityGraph(attributePaths = "category")
    List<Payment> findAll(Specification<Payment> spec);

}