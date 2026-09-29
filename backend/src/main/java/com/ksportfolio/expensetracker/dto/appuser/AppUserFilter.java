package com.ksportfolio.expensetracker.dto.appuser;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppUserFilter {
    private String searchText;
    private String role;
}
