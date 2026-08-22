package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.RoleDto;
import com.ksportfolio.expensetracker.entity.Role;
import com.ksportfolio.expensetracker.repository.RoleRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepo roleRepo;

    public List<RoleDto> getRoles() {
        List<Role> roles = roleRepo.findAll();
        return roles.stream().map(
            role -> new RoleDto(role.getId(),role.getName())
        ).toList();
    }
}
