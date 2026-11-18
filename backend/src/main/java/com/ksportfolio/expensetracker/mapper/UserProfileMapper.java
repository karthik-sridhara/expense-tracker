package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.auth.RegisterRequestDto;
import com.ksportfolio.expensetracker.dto.profile.UserProfileUpdateRequest;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.UserProfile;

public class UserProfileMapper {

    public static UserProfile toEntity(RegisterRequestDto registerRequestDto, AppUser user) {
        UserProfile entity = new UserProfile();
        entity.setName(registerRequestDto.getName());
        entity.setUser(user);
        return entity;
    }

    public static void toEntity(UserProfile profile, UserProfileUpdateRequest request) {
        profile.setName(request.name());
        profile.setGender(request.gender());
        profile.setDob(request.dob());
        profile.setIncome(request.income());
        profile.setCurrency(request.currency());
        profile.setTimezone(request.timezone());
    }
}
