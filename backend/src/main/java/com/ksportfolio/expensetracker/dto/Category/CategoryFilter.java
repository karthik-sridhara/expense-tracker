package com.ksportfolio.expensetracker.dto.Category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryFilter {
    private Integer userId;
    private Boolean isIncome;
    private Boolean isActive;
    private String searchText;
}