package com.ksportfolio.expensetracker.dto.appuser;


import com.ksportfolio.expensetracker.entity.Role;
import com.ksportfolio.expensetracker.type.Gender;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class AppUserDto {
    private Integer id;
    private String email;
    private Role role;
    private Instant createdAt;
    private Instant modifiedAt;
    private String name;
    private Gender gender;
    private LocalDate dob;
    private Integer version;
}
