package com.ksportfolio.expensetracker.dto.category;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryFilter {
    private Integer userId;
    private Boolean isIncome;
    private Boolean isActive;
    private String searchText;
    private Boolean universal;
}