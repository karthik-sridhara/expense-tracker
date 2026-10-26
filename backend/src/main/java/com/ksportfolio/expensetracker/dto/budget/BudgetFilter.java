package com.ksportfolio.expensetracker.dto.budget;


import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

@Setter
@Getter
@Validated
public class BudgetFilter {

    @Setter(AccessLevel.NONE)
    private Integer userId;
    private DurationType durationType;
    @Size(max = 100)
    private String searchText;

    public void setUser(Integer userId) {
        this.userId = userId;
    }
}
