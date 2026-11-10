package com.ksportfolio.expensetracker.dto.app;

import java.time.Clock;
import java.time.LocalDate;

/**
 * Holds the two clocks used for recurring payments.
 *
 * @param generation clock in the earliest time zone (UTC+14 by default). Used for the
 *                   scheduler's "today", so payments are generated before the date begins anywhere.
 * @param validation clock in the latest time zone (UTC-12 by default). Used for
 *                   "is this date in the past?" checks, so no user's local today is rejected.
 */
public record AppClock(Clock generation, Clock validation) {

    public LocalDate generationToday() {
        return LocalDate.now(generation);
    }

    public LocalDate validationToday() {
        return LocalDate.now(validation);
    }
}
