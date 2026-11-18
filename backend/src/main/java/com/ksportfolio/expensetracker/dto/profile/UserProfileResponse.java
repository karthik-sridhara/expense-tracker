package com.ksportfolio.expensetracker.dto.profile;

import com.ksportfolio.expensetracker.entity.UserProfile;
import com.ksportfolio.expensetracker.type.Gender;

import java.math.BigDecimal;
import java.time.LocalDate;

public record UserProfileResponse(
    String name,
    Gender gender,
    LocalDate dob,
    BigDecimal income,
    String currency,
    String timezone
) {
    public static UserProfileResponse from(UserProfile p) {
        return new UserProfileResponse(
            p.getName(), p.getGender(), p.getDob(), p.getIncome(), p.getCurrency(), p.getTimezone());
    }
}
