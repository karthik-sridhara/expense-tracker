package com.ksportfolio.expensetracker.dto.apptransaction;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class AppTransactionFilter {
    private Integer currentlyLoggedInUser;
    private String searchText;
    private Instant from;
    private Instant to;
    private Integer category;
    private Boolean income;
}
