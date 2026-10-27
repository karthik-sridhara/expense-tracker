package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppUserRepo extends JpaRepository<AppUser, Integer>, JpaSpecificationExecutor<AppUser> {

    @EntityGraph(attributePaths="role")
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Integer id);

    @Override
    @EntityGraph(attributePaths = "role")
    Optional<AppUser> findById(Integer id);

    @Override
    @EntityGraph(attributePaths="role")
    List<AppUser> findAll(Specification<AppUser> spec);

    @Override
    @EntityGraph(attributePaths="role")
    Page<AppUser> findAll(Specification<AppUser> spec, Pageable pageable);

    @Modifying
    @Query("UPDATE AppUser a SET a.password = :newPassword,a.passwordExpired = false WHERE a.id = :userId")
    void changePassword(@Param("userId") Integer userId, @Param("newPassword") String newPassword);
}
