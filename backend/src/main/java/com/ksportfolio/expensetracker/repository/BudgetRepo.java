package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Budget;
import com.ksportfolio.expensetracker.type.DurationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface BudgetRepo extends JpaRepository<Budget, Integer>, JpaSpecificationExecutor<Budget> {
    boolean existsByDurationTypeAndCategoryIdAndUserId(DurationType durationType,Integer categoryId ,Integer userId);
    boolean existsByDurationTypeAndCategoryIdAndUserIdAndIdNot(DurationType durationType,Integer categoryId ,Integer userId,Integer budgetId);
    Optional<Budget> findByUserIdAndId(Integer userId, Integer id);

    @Override
    @EntityGraph(attributePaths = "category")
    Page<Budget> findAll(Specification<Budget> spec, Pageable pageable);

    @Modifying
    @Query("delete from Budget b where b.id = :id and b.user.id = :userId")
    int deleteOwned(@Param("id") Integer id, @Param("userId") Integer userId);

}
