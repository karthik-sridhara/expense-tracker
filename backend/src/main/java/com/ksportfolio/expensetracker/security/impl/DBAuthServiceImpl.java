package com.ksportfolio.expensetracker.security.impl;

import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.auth.LoginResponseDto;
import com.ksportfolio.expensetracker.security.AuthService;
import com.ksportfolio.expensetracker.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DBAuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Override
    public LoginResponseDto authenticate(String username, String password) {
        Authentication authRequest  = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authResult  = authenticationManager.authenticate(authRequest);
        AppUserDetails userDetails = (AppUserDetails) authResult.getPrincipal();
        return new LoginResponseDto(
            jwtService.generateToken(userDetails),
            userDetails.getUserId(),
            userDetails.getUsername(),
            userDetails.getRoleId(),
            userDetails.getPasswordExpired()
        );
    }
}
