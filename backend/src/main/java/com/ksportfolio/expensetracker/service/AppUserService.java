package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.AppConstant;
import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.AppUserDto;
import com.ksportfolio.expensetracker.dto.AppUserRequestDto;
import com.ksportfolio.expensetracker.dto.auth.ChangePasswordRequest;
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
    private final AppContextService  appContextService;

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

    @Transactional
    public void registerUser(RegisterRequestDto request) {
        boolean isExist = appUserRepo.existsByEmail(request.getEmail());
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.EMAIL_ALREADY_EXIST, request.getEmail());
        }
        Role role = roleRepo.getReferenceById(AppConstant.ROLE_USER);
        AppUser user = AppUserMapper.toEntity(request,role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        appUserRepo.save(user);
    }

    @Transactional
    public void createUser(AppUserRequestDto request) {
        boolean isExist = appUserRepo.existsByEmail(request.getEmail());
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.EMAIL_ALREADY_EXIST, request.getEmail());
        }
        Role role = roleRepo.getReferenceById(request.getRole());
        AppUser user = AppUserMapper.toEntity(request,role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        appUserRepo.save(user);
    }

    @Transactional
    public void updateUser(AppUserRequestDto request, Integer id) {
        AppUser user = appUserRepo.findById(id).orElseThrow(
            () -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND, id)
        );
        boolean isExist = appUserRepo.existsByEmailAndIdNot(request.getEmail(),id);
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.EMAIL_ALREADY_EXIST, request.getEmail());
        }
        Role role = roleRepo.getReferenceById(request.getRole());
        AppUserMapper.toEntity(user,request,role);
        appUserRepo.save(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        AppUser user = appUserRepo.findById(id).orElseThrow(
                () -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND, id)
        );
        appUserRepo.delete(user);
    }

    public boolean checkEmail(String email) {
        email =  email.trim();
        return appUserRepo.existsByEmail(email);
    }

    public AppUserDto getCurrentUser() {
        Integer userId = appContextService.getUserId();
        return getUserById(userId);
    }

    @Transactional
    public void updateCurrentUser(AppUserRequestDto request) {
        Integer userId = appContextService.getUserId();
        request.setRole(AppConstant.ROLE_USER);
        updateUser(request,userId);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request,Integer id) {
        AppUser user = appUserRepo.findById(id).orElseThrow(
                () -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND, id)
        );
        if(!passwordEncoder.matches(request.getCurrentPassword(),user.getPassword()))
            throw new BusinessLogicException(ErrorCode.PASSWORD_MISMATCH);
        if(passwordEncoder.matches(request.getNewPassword(),user.getPassword()))
            throw new BusinessLogicException(ErrorCode.NEW_PASSWORD_MATCH_OLD);
        if(!request.getNewPassword().equals(request.getConfirmPassword()))
            throw new BusinessLogicException(ErrorCode.NEW_AND_CONFIRM_PASSWORD);
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        appUserRepo.changePassword(id, encodedPassword);
    }

}
