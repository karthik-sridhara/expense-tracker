package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.constant.AppUserConstant;
import com.ksportfolio.expensetracker.dto.AppUserDto;
import com.ksportfolio.expensetracker.entity.AppUser;

public class AppUserMapper {

    public static AppUserDto builder(AppUser entity) {
        AppUserDto dto = new AppUserDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setGender(entity.getGender() ? AppUserConstant.male : AppUserConstant.female);
        dto.setDob(entity.getDob());
        dto.setEmail(entity.getEmail());
        dto.setRole(entity.getRole());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setModifiedAt(entity.getModifiedAt());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setModifiedBy(entity.getModifiedBy());
        return dto;
    }
}
