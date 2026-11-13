package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.dto.appuser.AppUserDto;
import com.ksportfolio.expensetracker.dto.appuser.AppUserFilter;
import com.ksportfolio.expensetracker.dto.appuser.AppUserRequestDto;
import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.auth.ChangePasswordRequest;
import com.ksportfolio.expensetracker.dto.response.ApiPage;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.service.AppUserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping(version = "1.0",value="/admin")
    public ResponseEntity<ApiResponse<ApiPage<AppUserDto>>> getUsers(
        @Valid @ModelAttribute AppUserFilter filter,
        @PageableDefault(size = 20, sort = "modifiedAt", direction = Sort.Direction.DESC)
        Pageable pageable
    ) {
        ApiResponse<ApiPage<AppUserDto>> response = new ApiResponse<>(
                "Users retrieved successfully", appUserService.getUsers(filter, pageable)
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

    @PutMapping(version = "1.0",value="/admin/{id}/password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @PathVariable Integer id
    ) {
        appUserService.changePasswordByAdmin(request,id);
        ApiResponse<Void> response = new ApiResponse<>(
                "Password reset successfully", null
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
    public ResponseEntity<ApiResponse<Boolean>> checkEmail(@RequestBody @NotNull @Email String email) {
        boolean isEmailUsed = appUserService.checkEmail(email);
        String message = isEmailUsed ? "Email address is already used." : "Email address is not used";
        ApiResponse<Boolean> response = new ApiResponse<>(
            message, isEmailUsed
        );
        return response.toResponseEntity();
    }

    @GetMapping(value = "/current-user", version = "1.0")
    public ResponseEntity<ApiResponse<AppUserDto>> getCurrentUser(
        @AuthenticationPrincipal AppUserDetails userDetails
    ) {
        AppUserDto user = appUserService.getUserById(userDetails.getUserId());
        ApiResponse<AppUserDto> response = new ApiResponse<>(
                "User retrieved successfully",
                user
        );
        return response.toResponseEntity();
    }

}
