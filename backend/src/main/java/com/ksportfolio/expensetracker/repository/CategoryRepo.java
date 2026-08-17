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
    List<Category> findByUserIdOrIsUniversal(Integer userId, boolean isUniversal);
    Boolean existsByUserIdAndName(Integer userId, String name);
    Boolean existsByNameAndIsUniversal(String name, boolean isUniversal);
    Boolean existsByUserIdAndNameAndIdNot(Integer userId, String name, Integer id);
    Boolean existsByNameAndIsUniversalAndIdNot(String name, boolean isUniversal, Integer id);

}
