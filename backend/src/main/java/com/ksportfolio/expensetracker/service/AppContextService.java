package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.dto.auth.AppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppContextService {


    public AppUserDetails getUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        assert authentication != null;
        AppUserDetails  userDetails = (AppUserDetails) authentication.getPrincipal();
        assert userDetails != null;
        return userDetails;
    }

    public Integer getUserId() {
        AppUserDetails  userDetails = getUserDetails();
        return  userDetails.getUserId();
    }

}
