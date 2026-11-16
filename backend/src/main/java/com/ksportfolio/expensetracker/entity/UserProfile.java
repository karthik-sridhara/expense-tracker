package com.ksportfolio.expensetracker.entity;

import com.ksportfolio.expensetracker.mapper.DurationTypeConverter;
import com.ksportfolio.expensetracker.mapper.GenderConverter;
import com.ksportfolio.expensetracker.type.Gender;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "USER_PROFILE")
@Getter
@Setter
@NoArgsConstructor
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "image", length = 255)
    private String image;

    @Column(name = "gender", length = 1)
    @Convert(converter = GenderConverter.class)
    private Gender gender;

    @Column(name = "dob")
    private LocalDate dob;

    @DecimalMin(value = "0", inclusive = false)
    @Column(name = "income", precision = 12, scale = 2)
    private BigDecimal income;

    @Column(name = "currency", nullable = false, columnDefinition = "CHAR(3)", length = 3)
    private String currency;

    @Column(name = "timezone", nullable = false, length = 50)
    private String timezone;
}