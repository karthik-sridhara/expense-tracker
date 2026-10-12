package com.ksportfolio.expensetracker.entity;

import com.ksportfolio.expensetracker.mapper.DurationTypeConverter;
import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "RECURRING_PAYMENT")
public class RecurringPayment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;

    @NotBlank
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 300)
    @Column(name = "description", length = 300)
    private String description;

    @NotNull
    @Convert(converter = DurationTypeConverter.class)
    @Column(name = "recurring", nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private DurationType recurring;

    @Min(1)
    @Max(31)
    @Column(name = "day")
    private Integer day;

    @Min(1)
    @Max(12)
    @Column(name = "month")
    private Integer month;

    @NotNull
    @DecimalMin(value = "0", inclusive = false)
    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @NotNull
    @Column(name = "isActive", nullable = false)
    private Boolean active = true;

    @Column(name = "endDate")
    private LocalDate endDate;
}
