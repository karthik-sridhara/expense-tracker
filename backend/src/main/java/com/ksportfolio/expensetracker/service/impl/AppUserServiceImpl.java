package com.ksportfolio.expensetracker.service.impl;

import com.ksportfolio.expensetracker.dto.AppUserDto;
import com.ksportfolio.expensetracker.mapper.AppUserMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserServiceImpl implements AppUserService {

    private final AppUserRepo appUserRepo;

    @Override
    public List<AppUserDto> getUsers() {
        return appUserRepo.findAll().stream().map(AppUserMapper::builder).toList();
    }

    public AppUserDto getUserById(Integer id) {
        return appUserRepo.findById(id).map(AppUserMapper::builder).orElseThrow(

        );
    }
}
