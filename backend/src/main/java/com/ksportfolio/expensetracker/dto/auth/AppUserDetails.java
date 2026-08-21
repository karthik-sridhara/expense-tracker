package com.ksportfolio.expensetracker.dto.auth;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
public class AppUserDetails implements UserDetails {
    private final String username;
    private final String password;
    private final Integer userId;
    private final String roleId;
    private final String name;

    public AppUserDetails(Integer userId, String email, String password, String name, String roleId) {
        this.userId = userId;
        this.username = email;
        this.password = password;
        this.name = name;
        this.roleId = roleId;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_"+roleId));
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
