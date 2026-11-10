package com.ksportfolio.expensetracker.utility;

import com.ksportfolio.expensetracker.type.DurationType;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

/**
 * Computes the due dates of a recurring schedule inside a date window.
 * Semantics match RecurringPaymentService#validateSchedule:
 * DAILY no day/month, WEEKLY day = 1..7 (ISO, 1 = Monday), MONTHLY day = 1..31, YEARLY day + month.
 * Days past the end of a month are clamped (31 → 30 / 28 / 29, Feb 29 → Feb 28 in non-leap years).
 */
public final class RecurrenceCalculator {

    private RecurrenceCalculator() {}

    /** Occurrences with {@code from <= date <= to}, in ascending order. Empty if from is after to. */
    public static List<LocalDate> occurrences(
        DurationType type, Integer day, Integer month,
        LocalDate from, LocalDate to
    ) {
        List<LocalDate> result = new ArrayList<>();
        if (from.isAfter(to)) {
            return result;
        }
        switch (type) {
            case DAILY -> {
                for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
                    result.add(d);
                }
            }
            case WEEKLY -> {
                LocalDate d = from.with(TemporalAdjusters.nextOrSame(DayOfWeek.of(day)));
                for (; !d.isAfter(to); d = d.plusWeeks(1)) {
                    result.add(d);
                }
            }
            case MONTHLY -> {
                for (YearMonth ym = YearMonth.from(from); !ym.isAfter(YearMonth.from(to)); ym = ym.plusMonths(1)) {
                    addIfInRange(result, clamp(ym, day), from, to);
                }
            }
            case YEARLY -> {
                for (int year = from.getYear(); year <= to.getYear(); year++) {
                    addIfInRange(result, clamp(YearMonth.of(year, month), day), from, to);
                }
            }
        }
        return result;
    }

    private static LocalDate clamp(YearMonth ym, int day) {
        return ym.atDay(Math.min(day, ym.lengthOfMonth()));
    }

    private static void addIfInRange(List<LocalDate> out, LocalDate d, LocalDate from, LocalDate to) {
        if (!d.isBefore(from) && !d.isAfter(to)) {
            out.add(d);
        }
    }
}
