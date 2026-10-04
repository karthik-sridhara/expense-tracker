package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.AppTransaction;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppTransactionRepo extends CrudRepository<AppTransaction, Integer>, JpaSpecificationExecutor<AppTransaction> {

    @EntityGraph(attributePaths = "category")
    List<AppTransaction> findAll(Specification<AppTransaction> spec);
    Optional<AppTransaction> findByIdAndUserId(Integer id,Integer userId);

}
