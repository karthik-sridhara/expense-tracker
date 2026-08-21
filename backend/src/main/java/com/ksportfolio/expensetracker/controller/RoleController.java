package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.RoleDto;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoleDto>>> getAppRoles(){
        ApiResponse<List<RoleDto>> response = new ApiResponse<>(
            "Retrieving all roles",
            roleService.getRoles()
        );
        return response.toResponseEntity();
    }
}
