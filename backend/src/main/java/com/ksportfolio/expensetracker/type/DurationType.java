package com.ksportfolio.expensetracker.type;

import lombok.Getter;

@Getter
public enum DurationType {
    DAILY(0),
    WEEKLY(3),
    MONTHLY(7),
    YEARLY(15);

    /** How many days before the due date a recurring payment is generated. */
    private final int leadDays;

    DurationType(int leadDays) {
        this.leadDays = leadDays;
    }
}
