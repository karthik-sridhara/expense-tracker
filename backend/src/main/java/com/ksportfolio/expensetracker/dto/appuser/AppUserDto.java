package com.ksportfolio.expensetracker.dto.appuser;


import com.ksportfolio.expensetracker.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class AppUserDto {
    Integer id;
    String email;
    Role role;
    Instant createdAt;
    Instant modifiedAt;
}
