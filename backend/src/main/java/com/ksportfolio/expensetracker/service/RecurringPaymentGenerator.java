package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.app.AppClock;
import com.ksportfolio.expensetracker.entity.Payment;
import com.ksportfolio.expensetracker.entity.RecurringPayment;
import com.ksportfolio.expensetracker.repository.PaymentRepo;
import com.ksportfolio.expensetracker.repository.RecurringPaymentRepo;
import com.ksportfolio.expensetracker.utility.RecurrenceCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * Turns recurring schedules into concrete {@link Payment} rows.
 *
 * <p>{@code lastGeneratedDate} on the schedule is a cursor: every occurrence with a due date
 * on or before it has already been generated. Each run covers
 * {@code (cursor, min(today + leadDays, endDate)]}, so missed runs (downtime) are caught up
 * automatically, and nothing is generated twice.</p>
 */
@Service
@RequiredArgsConstructor
public class RecurringPaymentGenerator {

    private final RecurringPaymentRepo recurringPaymentRepo;
    private final PaymentRepo paymentRepo;
    private final AppClock appClock;

    /** Used by the scheduler: each schedule in its own transaction so one failure doesn't stop the batch. */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public int generateOne(Integer recurringPaymentId) {
        return recurringPaymentRepo.findById(recurringPaymentId)
                .map(this::generateFor)
                .orElse(0);
    }

    /**
     * Generates all due payments for one schedule and advances its cursor.
     * Runs in the caller's transaction; the schedule must be a managed entity.
     *
     * @return number of payments created
     */
    @Transactional
    public int generateFor(RecurringPayment r) {
        if (!Boolean.TRUE.equals(r.getActive())) {
            return 0;
        }
        LocalDate today = appClock.generationToday();
        LocalDate cursor = r.getLastGeneratedDate() != null ? r.getLastGeneratedDate() : today.minusDays(1);

        LocalDate from = cursor.plusDays(1);
        LocalDate to = today.plusDays(r.getRecurring().getLeadDays());
        if (r.getEndDate() != null && r.getEndDate().isBefore(to)) {
            to = r.getEndDate();
        }

        int created = 0;
        if (!from.isAfter(to)) {
            for (LocalDate due : RecurrenceCalculator.occurrences(r.getRecurring(), r.getDay(), r.getMonth(), from, to)) {
                if (!paymentRepo.existsByRecurringPaymentIdAndDueDate(r.getId(), due)) {
                    paymentRepo.save(toPayment(r, due));
                    created++;
                }
            }
            r.setLastGeneratedDate(to);
        }

        // schedule finished: everything up to endDate has been generated
        if (r.getEndDate() != null && r.getEndDate().isBefore(today)) {
            r.setActive(false);
        }
        return created;
    }

    private Payment toPayment(RecurringPayment r, LocalDate dueDate) {
        Payment p = new Payment();
        p.setName(r.getName());
        p.setDescription(r.getDescription());
        p.setCategory(r.getCategory());
        p.setUser(r.getUser());
        p.setAmount(r.getAmount());
        p.setDueDate(dueDate);
        p.setRecurringPayment(r);
        return p;
    }
}
