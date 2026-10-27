package com.ksportfolio.expensetracker.dto.category;

import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
public class CategoryFilter {
    @Setter(AccessLevel.NONE)
    @Getter(AccessLevel.NONE)
    private Integer userId;
    private Boolean isIncome;
    private Boolean isActive;
    @Size(max = 100)
    private String searchText;
    private Boolean universal;

    public void appSetUser(Integer userId) {
        this.userId = userId;
    }
    public Integer appGetUser() {
        return this.userId;
    }
}