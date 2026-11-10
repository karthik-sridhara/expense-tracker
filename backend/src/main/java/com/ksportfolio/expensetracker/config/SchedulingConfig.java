package com.ksportfolio.expensetracker.config;

import com.ksportfolio.expensetracker.dto.app.AppClock;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
@EnableScheduling
public class SchedulingConfig {

    @Bean
    public AppClock appClock(
        // must be the same property the scheduler's cron zone uses
        @Value("${app.recurring.zone:Pacific/Kiritimati}") String generationZone,
        @Value("${app.recurring.validation-zone:Etc/GMT+12}") String validationZone
    ) {
        return new AppClock(
                Clock.system(ZoneId.of(generationZone)),
                Clock.system(ZoneId.of(validationZone))
        );
    }
}
