package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.RecurringPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecurringPaymentRepo extends JpaRepository<RecurringPayment, Integer>,
        JpaSpecificationExecutor<RecurringPayment> {

    @EntityGraph(attributePaths = "category")
    List<RecurringPayment> findAll(Specification<RecurringPayment> spec);

    @Override
    @EntityGraph(attributePaths = "category")
    Page<RecurringPayment> findAll(Specification<RecurringPayment> spec, Pageable pageable);

    @EntityGraph(attributePaths = "category")
    Optional<RecurringPayment> findByIdAndUserId(Integer id, Integer userId);

    /**
     * Keyset pagination over active schedule IDs: pass the last ID of the previous batch
     * (0 for the first). Stable even when schedules are deactivated mid-run.
     */
    @Query("select r.id from RecurringPayment r where r.active = true and r.id > :afterId order by r.id")
    List<Integer> findActiveIdsAfter(@Param("afterId") Integer afterId, Pageable pageable);
}
