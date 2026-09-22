package com.ksportfolio.expensetracker.dto.Budget;


import com.ksportfolio.expensetracker.type.DurationType;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class BudgetFilter {
    private DurationType durationType;
    private Integer userId;
}
