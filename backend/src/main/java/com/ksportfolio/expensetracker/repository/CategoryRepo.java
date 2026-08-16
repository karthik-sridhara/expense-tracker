package com.ksportfolio.expensetracker.repository;

import com.ksportfolio.expensetracker.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Integer> {

    @Query(name="Category.findByUserId")
    List<Category> getAllByUser(@Param("userId") Integer userId);
}
