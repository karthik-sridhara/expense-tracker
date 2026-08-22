package com.ksportfolio.expensetracker.entity;

import com.ksportfolio.expensetracker.mapper.DurationTypeConverter;
import com.ksportfolio.expensetracker.type.DurationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.NamedQuery;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import java.math.BigDecimal;

@Entity
@Table(name = "BUDGET")
@Getter
@Setter
@NamedQuery(name = "Budget.findByUserId", query = "SELECT b FROM Budget b WHERE b.user.id = :userId")
public class Budget extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Integer id;

    @NotNull
    @DecimalMin(value = "0", inclusive = false)
    @Column(name = "limit_amount", nullable = false)
    private BigDecimal amount;

    @NotNull
    @Column(name = "type", nullable = false)
    @Convert(converter = DurationTypeConverter.class)
    private DurationType durationType;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
}




