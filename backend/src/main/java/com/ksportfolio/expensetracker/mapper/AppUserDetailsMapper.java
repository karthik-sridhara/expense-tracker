package com.ksportfolio.expensetracker.mapper;


import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.entity.AppUser;

public class AppUserDetailsMapper {

    public static AppUserDetails map(AppUser entity) {
        return new AppUserDetails(
                entity.getId(),
                entity.getEmail(),
                entity.getPassword(),
                entity.getName(),
                entity.getRole().getId()
        );
    }
}
