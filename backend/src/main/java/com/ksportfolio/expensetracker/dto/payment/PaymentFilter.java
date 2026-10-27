package com.ksportfolio.expensetracker.dto.payment;

import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class PaymentFilter {
    @Setter(AccessLevel.NONE)
    @Getter(AccessLevel.NONE)
    private Integer userId;          // set by server only
    @Size(max = 100)
    private String searchText;       // name / description
    private Integer categoryId;
    private Boolean completed;       // true = transaction present, false = not
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dueFrom;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dueTo;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;

    public void appSetUser(Integer userId) {
        this.userId = userId;
    }
    public Integer appGetUser() {
        return this.userId;
    }
}