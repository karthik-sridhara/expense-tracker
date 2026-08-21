package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.constant.AppUserConstant;
import com.ksportfolio.expensetracker.dto.AppUserDto;
import com.ksportfolio.expensetracker.dto.auth.RegisterRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Role;

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

    public  static AppUser toEntity(RegisterRequestDto dto, Role role) {
        AppUser entity = new AppUser();
        entity.setName(dto.getName());
        entity.setDob(dto.getDob());
        entity.setEmail(dto.getEmail());
        entity.setGender(AppUserConstant.male == dto.getGender().charAt(0));
        entity.setRole(role);
        return entity;
    }
}
