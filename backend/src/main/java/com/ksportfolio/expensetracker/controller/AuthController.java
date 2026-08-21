package com.ksportfolio.expensetracker.controller;

import com.ksportfolio.expensetracker.constant.ErrorCode;
import com.ksportfolio.expensetracker.dto.auth.LoginRequestDto;
import com.ksportfolio.expensetracker.dto.auth.LoginResponseDto;
import com.ksportfolio.expensetracker.dto.auth.RegisterRequestDto;
import com.ksportfolio.expensetracker.dto.response.ApiResponse;
import com.ksportfolio.expensetracker.exception.BusinessLogicException;
import com.ksportfolio.expensetracker.service.AppUserService;
import com.ksportfolio.expensetracker.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AppUserService appUserService;

    @PostMapping(value = "/login",version = "1.0")
    public ResponseEntity<ApiResponse<LoginResponseDto>> login(@Valid @RequestBody LoginRequestDto request) {
        try {
            LoginResponseDto loginResponseDto = authService.authenticate(request.getUsername(), request.getPassword());
            ApiResponse<LoginResponseDto> response =  new ApiResponse<>(
                    "Login successful",
                    loginResponseDto
            );
            return response.toResponseEntity();
        } catch (BadCredentialsException ex) {
            throw new BusinessLogicException(ErrorCode.INVALID_CREDENTIALS);
        }
    }

    @PostMapping(value = "/registration",version = "1.0")
    public ResponseEntity<ApiResponse<Void>> registration(@Valid @RequestBody RegisterRequestDto request) {
        appUserService.registerUser(request);
        ApiResponse<Void> response =   new ApiResponse<>(
                "Registration successful",
                null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}