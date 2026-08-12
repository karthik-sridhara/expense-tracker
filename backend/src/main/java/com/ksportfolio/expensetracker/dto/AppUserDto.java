package com.ksportfolio.expensetracker.dto;


import com.ksportfolio.expensetracker.entity.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
public class AppUserDto {
    Integer id;
    String name;
    Character gender;
    LocalDate dob;
    String email;
    Role role;
    Integer createdBy;
    Instant createdAt;
    Integer modifiedBy;
    Instant modifiedAt;

}
