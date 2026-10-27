package com.ksportfolio.expensetracker.dto.appuser;


import com.ksportfolio.expensetracker.constant.AppConstant;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.springframework.validation.annotation.Validated;

@Getter
@Setter
@Validated
public class AppUserFilter {
    @Size(max = 100)
    private String searchText;
    @Pattern(
        regexp = AppConstant.ROLE_ADMIN + "|" + AppConstant.ROLE_USER + "|" + AppConstant.ROLE_EMPLOYEE,
        message = "Role must be one of ADMIN, USER, EMPLOYEE"
    )
    private String role;
}
