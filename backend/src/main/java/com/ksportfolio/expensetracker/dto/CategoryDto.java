package com.ksportfolio.expensetracker.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
public class CategoryDto {
    private Integer id;
    private String name;
    private String description;
    private String icon;
    private Boolean isIncome;
    private Boolean isUniversal;
    private Boolean isActive;
    private Integer userId;
    private Instant createdAt;
    private Instant modifiedAt;
}
