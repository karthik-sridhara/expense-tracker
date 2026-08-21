package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepo extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
}
