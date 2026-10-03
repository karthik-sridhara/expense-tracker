package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.AppTransaction;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.CrudRepository;

public interface AppTransactionRepo extends CrudRepository<AppTransaction, Integer>, JpaSpecificationExecutor<AppTransaction> {
}
