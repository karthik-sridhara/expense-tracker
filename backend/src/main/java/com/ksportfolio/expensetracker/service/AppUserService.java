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
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppUserService {

    private final AppUserRepo appUserRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final AppContextService  appContextService;

    public List<AppUserDto> getUsers(AppUserFilter filter) {
        return appUserRepo.findAll(getFilterForFindAll(filter))
                .stream().map(AppUserMapper::builder).toList();
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
        user.setPasswordExpired(true);
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

    @Transactional
    public void updateUser(AppUserRequestDto request, Integer id) {
        updateUserInternal(request, id);
    }

    @Transactional
    public void updateCurrentUser(AppUserRequestDto request) {
        Integer userId = appContextService.getUserId();
        request.setRole(AppConstant.ROLE_USER);
        updateUserInternal(request, userId);
    }

    private void updateUserInternal(AppUserRequestDto request, Integer id) {
        AppUser user = appUserRepo.findById(id)
                .orElseThrow(() ->
                        new BusinessLogicException(ErrorCode.USER_NOT_FOUND, id)
                );

        boolean emailExists =
                appUserRepo.existsByEmailAndIdNot(request.getEmail(), id);

        if (emailExists) {
            throw new BusinessLogicException(
                    ErrorCode.EMAIL_ALREADY_EXIST,
                    request.getEmail()
            );
        }

        Role role = roleRepo.getReferenceById(request.getRole());
        AppUserMapper.toEntity(user, request, role);
        appUserRepo.save(user);
    }

    private Specification<AppUser> getFilterForFindAll(AppUserFilter filter){

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            if (query.getResultType() != Long.class &&
                    query.getResultType() != long.class) {

                root.fetch("role", JoinType.INNER);
            }

            // Role filter
            if (filter.getRole() != null) {

                Join<AppUser, Role> roleJoin =
                        root.join("role", JoinType.INNER);

                predicates.add(
                        cb.equal(
                                roleJoin.get("id"),
                                filter.getRole()
                        )
                );
            }

            // Search by email OR name
            String searchText = filter.getSearchText();

            if (searchText != null && !searchText.isBlank()) {

                String searchPattern =
                        "%" + searchText.trim().toLowerCase() + "%";

                Predicate emailPredicate =
                        cb.like(
                                cb.lower(root.get("email")),
                                searchPattern
                        );

                Predicate namePredicate =
                        cb.like(
                                cb.lower(root.get("name")),
                                searchPattern
                        );

                predicates.add(
                        cb.or(emailPredicate, namePredicate)
                );
            }

            query.distinct(true);

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };

    }

}
