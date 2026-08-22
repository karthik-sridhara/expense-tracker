package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface AppUserRepo extends JpaRepository<AppUser, Integer> {
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Integer id);
    @Modifying
    @Transactional
    @Query("UPDATE AppUser a SET a.password = :newPassword WHERE a.id = :userId")
    void changePassword(@Param("userId") Integer userId, @Param("newPassword") String newPassword);
}
