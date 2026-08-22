package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.AppUserDto;
import com.ksportfolio.expensetracker.dto.AppUserRequestDto;
import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.auth.ChangePasswordRequest;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.AppUserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping(version = "1.0",value="/admin")
    public ResponseEntity<ApiResponse<List<AppUserDto>>> getUsers() {
        ApiResponse<List<AppUserDto>> response = new ApiResponse<>(
                "Users retrieved successfully", appUserService.getUsers()
        );
        return response.toResponseEntity();
    }

    @GetMapping(value="/admin/{userId}",version = "1.0")
    public ResponseEntity<ApiResponse<AppUserDto>> getUser(@PathVariable Integer userId) {
        ApiResponse<AppUserDto> response = new ApiResponse<>(
                "User retrieved successfully", appUserService.getUserById(userId)
        );
        return response.toResponseEntity();
    }

    @GetMapping(value="/admin/email/{email}",version = "1.0")
    public ResponseEntity<ApiResponse<AppUserDto>> getUserByEmail(@PathVariable String email) {
        ApiResponse<AppUserDto> response = new ApiResponse<>(
                "User retrieved successfully", appUserService.getUserByEmail(email)
        );
        return response.toResponseEntity();
    }

    @PostMapping(version = "1.0",value="/admin")
    public ResponseEntity<ApiResponse<Void>> createUser(@Valid @RequestBody AppUserRequestDto requestDto) {
        appUserService.createUser(requestDto);
        ApiResponse<Void> response = new ApiResponse<>(
            "Added user successfully", null
        );
        return response.toResponseEntity();
    }

    @PutMapping(version = "1.0",value="/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> updateUser(
        @Valid @RequestBody AppUserRequestDto requestDto,
        @PathVariable Integer id
    ) {
        appUserService.updateUser(requestDto,id);
        ApiResponse<Void> response = new ApiResponse<>(
                "User updated successfully", null
        );
        return response.toResponseEntity();
    }

    @DeleteMapping(version = "1.0",value="/admin/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(
            @PathVariable Integer id
    ) {
        appUserService.deleteUser(id);
        ApiResponse<Void> response = new ApiResponse<>(
                "User Deleted successfully", null
        );
        return response.toResponseEntity();
    }

    @PostMapping(version = "1.0",value = "/check-email")
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(@RequestBody @NotNull @NotBlank String email) {
        boolean isEmailUsed = appUserService.checkEmail(email);
        String message = isEmailUsed ? "Email address is already used." : "Email address is not used";
        ApiResponse<Boolean> response = new ApiResponse<>(
                message, isEmailUsed
        );
        return response.toResponseEntity();
    }

    @GetMapping(value="/current-user",version = "1.0")
    public ResponseEntity<ApiResponse<AppUserDto>> geCurrentUser() {
        ApiResponse<AppUserDto> response = new ApiResponse<>(
                "User retrieved successfully", appUserService.getCurrentUser()
        );
        return response.toResponseEntity();
    }

    @PutMapping(version = "1.0",value="/current-user")
    public ResponseEntity<ApiResponse<Void>> updateCurrentUser(
        @Valid @RequestBody AppUserRequestDto requestDto
    ) {
        appUserService.updateCurrentUser(requestDto);
        ApiResponse<Void> response = new ApiResponse<>(
                "User Updated successfully", null
        );
        return response.toResponseEntity();
    }

    @PatchMapping(version = "1.0",value = "/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
        @Valid @RequestBody ChangePasswordRequest changePasswordRequest,
        @AuthenticationPrincipal AppUserDetails appUserDetails
    ){
        appUserService.changePassword(changePasswordRequest,appUserDetails.getUserId());
        ApiResponse<Void> response = new ApiResponse<>(
                "Password updated successfully", null
        );
        return response.toResponseEntity();
    }



}
