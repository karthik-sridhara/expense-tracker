package com.ksportfolio.expensetracker.dto.apptransaction;

import com.ksportfolio.expensetracker.dto.Category.CategoryDto;
import com.ksportfolio.expensetracker.dto.appuser.AppUserDto;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
public class AppTransactionDto {

    private Integer id;
    private String name;
    private String description;
    private Integer userId;
    private CategoryDto category;
    private BigDecimal amount;
    private Instant transactionDate;
    private Instant createdAt;
    private Instant modifiedAt;

}
