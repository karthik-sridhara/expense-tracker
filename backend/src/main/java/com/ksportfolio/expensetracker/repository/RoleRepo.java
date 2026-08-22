package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepo extends JpaRepository<Role, String> {

}
