package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.AppUserDto;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppUserDto>>> getUsers() {
        ApiResponse<List<AppUserDto>> response = new ApiResponse<>(
                "Users retrieved successfully", appUserService.getUsers()
        );
        return response.toResponseEntity();
    }

}
