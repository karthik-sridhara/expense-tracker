package com.ksportfolio.expensetracker.dto.apptransaction;

import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class AppTransactionFilter {
    @Setter(AccessLevel.NONE)
    @Getter(AccessLevel.NONE)
    private Integer userId;
    @Size(min = 1, max = 100)
    private String searchText;
    private Instant from;
    private Instant to;
    private Integer category;
    private Boolean income;

    public void appSetUser(Integer userId) {
        this.userId = userId;
    }
    public Integer appGetUser() {
        return userId;
    }
}
