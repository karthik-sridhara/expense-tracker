package com.ksportfolio.expensetracker.scheduler;

import com.ksportfolio.expensetracker.repository.RecurringPaymentRepo;
import com.ksportfolio.expensetracker.service.RecurringPaymentGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Generates payments from active recurring schedules.
 * Runs nightly (cron in app.recurring.zone, UTC+14 by default) and once at startup to catch up after downtime.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RecurringPaymentScheduler {

    private static final int BATCH_SIZE = 100;

    private final RecurringPaymentRepo recurringPaymentRepo;
    private final RecurringPaymentGenerator generator;
    private final AtomicBoolean running = new AtomicBoolean(false);

    @Value("${app.recurring.run-on-startup:true}")
    private boolean runOnStartup;

    // zone must match the property used by SchedulingConfig's generation clock
    @Scheduled(cron = "${app.recurring.cron:0 5 0 * * *}", zone = "${app.recurring.zone:Pacific/Kiritimati}")
    public void runScheduled() {
        generateAll("scheduled");
    }

    @EventListener(ApplicationReadyEvent.class)
    public void runOnStartup() {
        if (runOnStartup) {
            generateAll("startup");
        }
    }

    void generateAll(String trigger) {
        if (!running.compareAndSet(false, true)) {
            log.warn("Recurring payment generation ({}) skipped: a run is already in progress", trigger);
            return;
        }
        long start = System.currentTimeMillis();
        int schedules = 0;
        int created = 0;
        int failed = 0;
        try {
            int afterId = 0;
            List<Integer> ids;
            do {
                ids = recurringPaymentRepo.findActiveIdsAfter(afterId, PageRequest.of(0, BATCH_SIZE));
                for (Integer id : ids) {
                    schedules++;
                    try {
                        created += generator.generateOne(id);
                    } catch (Exception ex) {
                        failed++;
                        log.error("Recurring payment generation failed for schedule id={}", id, ex);
                    }
                    afterId = id;
                }
            } while (ids.size() == BATCH_SIZE);
        } finally {
            running.set(false);
            log.info("Recurring payment generation ({}) done: schedules={} paymentsCreated={} failed={} durationMs={}",
                    trigger, schedules, created, failed, System.currentTimeMillis() - start);
        }
    }
}
