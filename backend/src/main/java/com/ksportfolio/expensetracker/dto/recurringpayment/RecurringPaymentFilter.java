package com.ksportfolio.expensetracker.dto.recurringpayment;

import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RecurringPaymentFilter {
    @Setter(AccessLevel.NONE)
    @Getter(AccessLevel.NONE)
    private Integer userId;             // set by server only
    @Size(max = 100)
    private String searchText;          // matches name or description
    private Integer category;
    private DurationType recurring;
    private Boolean active;

    public void appSetUser(Integer userId) {
        this.userId = userId;
    }
    public Integer appGetUser() {
        return this.userId;
    }
}