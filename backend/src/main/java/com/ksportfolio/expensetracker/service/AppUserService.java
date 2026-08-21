package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.AppUserDto;
import com.ksportfolio.expensetracker.dto.auth.RegisterRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Role;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.AppUserMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppUserService {

    private final AppUserRepo appUserRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;

    public List<AppUserDto> getUsers() {
        return appUserRepo.findAll().stream().map(AppUserMapper::builder).toList();
    }

    public AppUserDto getUserById(Integer id) {
        return appUserRepo.findById(id).map(AppUserMapper::builder).orElseThrow(
                () -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND, id)
        );
    }

    public AppUserDto getUserByEmail(String email) {
        return appUserRepo.findByEmail(email).map(AppUserMapper::builder).orElseThrow(
                ()-> new BusinessLogicException(ErrorCode.USER_NOT_FOUND_WITH_EMAIL, email)
        );
    }

    public void registerUser(RegisterRequestDto request) {
        boolean isExist = appUserRepo.existsByEmail(request.getEmail());
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.EMAIL_ALREADY_EXIST, request.getEmail());
        }
        Role role = roleRepo.getReferenceById("USER");
        AppUser user = AppUserMapper.toEntity(request,role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        appUserRepo.save(user);
    }
}
