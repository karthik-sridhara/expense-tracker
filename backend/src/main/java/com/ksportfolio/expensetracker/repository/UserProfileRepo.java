package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProfileRepo extends JpaRepository<UserProfile,Integer> {
}
