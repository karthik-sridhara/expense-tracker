package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.AppUserDto;

import java.util.List;

public interface AppUserService {
    List<AppUserDto> getUsers();
    AppUserDto getUserById(Integer id);
    AppUserDto getUserByEmail(String email);
}
