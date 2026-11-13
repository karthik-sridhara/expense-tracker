package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.constant.AppConstant;
import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.appuser.AppUserDto;
import com.ksportfolio.expensetracker.dto.appuser.AppUserFilter;
import com.ksportfolio.expensetracker.dto.appuser.AppUserRequestDto;
import com.ksportfolio.expensetracker.dto.auth.ChangePasswordRequest;
import com.ksportfolio.expensetracker.dto.auth.RegisterRequestDto;
import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.entity.Role;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.mapper.AppUserMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import com.ksportfolio.expensetracker.repository.RoleRepo;
import com.ksportfolio.expensetracker.dto.response.ApiPage;
import com.ksportfolio.expensetracker.mapper.PageMapper;
import com.ksportfolio.expensetracker.utility.PaginationUtility;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppUserService {

    private final AppUserRepo appUserRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final AppContextService  appContextService;

    private static final Set<String> SORTABLE = Set.of("name", "email", "createdAt", "modifiedAt");

    public ApiPage<AppUserDto> getUsers(AppUserFilter filter, Pageable pageable) {
        PaginationUtility.validateSort(pageable, SORTABLE);
        Page<AppUserDto> page = appUserRepo.findAll(getFilterForFindAll(filter), pageable)
                .map(AppUserMapper::toDto);
        return PageMapper.toDto(page);
    }

    public AppUserDto getUserById(Integer id) {
        return AppUserMapper.toDto(getUser(id));
    }

    @Transactional
    public void registerUser(RegisterRequestDto request) {
        boolean isExist = isEmailUsed(request.getEmail());
        if (isExist) {
            throw new BusinessLogicException(ErrorCode.EMAIL_ALREADY_EXIST, request.getEmail());
        }
        Role role = roleRepo.getReferenceById(AppConstant.ROLE_USER);
        AppUser user = AppUserMapper.toEntity(request,role);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        appUserRepo.save(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        AppUser user = getUser(id);
        appUserRepo.delete(user);
    }

    public boolean checkEmail(String email) {
        return isEmailUsed(email);
    }

    private boolean isEmailUsed(String email) {
        if(email == null) {
            return false;
        }
        email =  email.trim();
        return appUserRepo.existsByEmail(email);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request,Integer id) {
        AppUser user = getUser(id);
        if(!passwordEncoder.matches(request.getCurrentPassword(),user.getPassword()))
            throw new BusinessLogicException(ErrorCode.PASSWORD_MISMATCH);
        if(passwordEncoder.matches(request.getNewPassword(),user.getPassword()))
            throw new BusinessLogicException(ErrorCode.NEW_PASSWORD_MATCH_OLD);
        if(!request.getNewPassword().equals(request.getConfirmPassword()))
            throw new BusinessLogicException(ErrorCode.NEW_AND_CONFIRM_PASSWORD);
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        appUserRepo.changePassword(id, encodedPassword,false);
    }

    @Transactional
    public void changePasswordByAdmin(ChangePasswordRequest request,Integer id) {
        if(!request.getNewPassword().equals(request.getConfirmPassword()))
            throw new BusinessLogicException(ErrorCode.NEW_AND_CONFIRM_PASSWORD);
        String encodedPassword = passwordEncoder.encode(request.getNewPassword());
        int noOfRowUpdated = appUserRepo.changePassword(id, encodedPassword,true);
        if(noOfRowUpdated != 1) {
            throw new BusinessLogicException(ErrorCode.USER_NOT_FOUND, id);
        }
    }

    @Transactional
    public void updateUser(AppUserRequestDto request, Integer id) {
        AppUser user = getUser(id);
        request.setEmail(request.getEmail().trim());
        boolean emailExists = appUserRepo.existsByEmailAndIdNot(request.getEmail(), id);
        if (emailExists) {
            throw new BusinessLogicException(
                ErrorCode.EMAIL_ALREADY_EXIST,
                request.getEmail()
            );
        }
        Role role = roleRepo.getReferenceById(request.getRole());
        AppUserMapper.updateEntity(user, request, role);
        appUserRepo.save(user);
    }

    private AppUser getUser(Integer id) {
        return appUserRepo.findById(id).orElseThrow(
            () -> new BusinessLogicException(ErrorCode.USER_NOT_FOUND, id)
        );
    }

    private Specification<AppUser> getFilterForFindAll(AppUserFilter filter){

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            // Role filter
            if (filter.getRole() != null) {
                predicates.add(
                    cb.equal(root.get("role").get("id"), filter.getRole())
                );
            }

            // Search by email OR name
            String searchText = filter.getSearchText();
            if (searchText != null && !searchText.isBlank()) {
                String searchPattern = "%" + searchText.trim().toLowerCase() + "%";
                predicates.add(
                    cb.or(
                        cb.like(cb.lower(root.get("email")),searchPattern),
                        cb.like(cb.lower(root.get("name")),searchPattern)
                    )
                );
            }

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };

    }

}
