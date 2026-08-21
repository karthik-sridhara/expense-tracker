package com.ksportfolio.expensetracker.service.impl;

import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import com.ksportfolio.expensetracker.dto.auth.LoginResponseDto;
import com.ksportfolio.expensetracker.service.AuthService;
import com.ksportfolio.expensetracker.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            userDetails.getName(),
            userDetails.getRoleId()
        );
    }
}
