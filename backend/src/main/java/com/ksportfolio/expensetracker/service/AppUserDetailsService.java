package com.ksportfolio.expensetracker.service;

import com.ksportfolio.expensetracker.entity.AppUser;
import com.ksportfolio.expensetracker.mapper.AppUserDetailsMapper;
import com.ksportfolio.expensetracker.repository.AppUserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AppUserDetailsService implements UserDetailsService {

    private final AppUserRepo appUserRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = appUserRepo.findByEmail(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with username: " + username)
        );
        return AppUserDetailsMapper.map(appUser);
    }
}
