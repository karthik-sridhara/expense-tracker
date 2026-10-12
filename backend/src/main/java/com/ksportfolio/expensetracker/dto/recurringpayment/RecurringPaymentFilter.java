package com.ksportfolio.expensetracker.dto.recurringpayment;

import com.ksportfolio.expensetracker.type.DurationType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RecurringPaymentFilter {
    private Integer currentlyLoggedInUser;
    private String searchText;          // matches name or description
    private Integer category;
    private DurationType recurring;
    private Boolean active;
}