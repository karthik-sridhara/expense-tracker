package com.ksportfolio.expensetracker.mapper;

import com.ksportfolio.expensetracker.dto.appuser.AppUserDto;
import com.ksportfolio.expensetracker.dto.appuser.AppUserRequestDto;
import com.ksportfolio.expensetracker.dto.auth.RegisterRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Role;

public class AppUserMapper {

    public static AppUserDto toDto(AppUser entity) {
        AppUserDto dto = new AppUserDto();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setRole(entity.getRole());
        dto.setVersion(entity.getVersion());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setModifiedAt(entity.getModifiedAt());
        return dto;
    }

    public static AppUserDto toDtoWithProfile(AppUser entity) {
        AppUserDto dto = new AppUserDto();
        dto.setId(entity.getId());
        dto.setEmail(entity.getEmail());
        dto.setRole(entity.getRole());
        dto.setName(entity.getProfile().getName());
        dto.setGender(entity.getProfile().getGender());
        dto.setDob(entity.getProfile().getDob());
        dto.setVersion(entity.getVersion());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setModifiedAt(entity.getModifiedAt());
        return dto;
    }

    public  static AppUser toEntity(RegisterRequestDto dto, Role role) {
        AppUser entity = new AppUser();
        entity.setEmail(dto.getEmail());
        entity.setRole(role);
        entity.setPasswordExpired(false);
        return entity;
    }

    public static AppUser updateEntity(AppUser entity, AppUserRequestDto dto, Role role) {
        entity.setEmail(dto.getEmail());
        entity.setRole(role);
        return entity;
    }
}
