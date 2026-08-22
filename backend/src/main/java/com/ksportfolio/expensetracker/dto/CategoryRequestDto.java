package com.ksportfolio.expensetracker.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRequestDto {

    @NotNull
    @Size(max = 50)
    private String name;

    @Size(max = 300)
    private String description;

    @Size(max = 50)
    private String icon;

    @NotNull
    private Boolean isIncome;

    @NotNull
    private Boolean isUniversal;

    @NotNull
    private Boolean isActive;
}
