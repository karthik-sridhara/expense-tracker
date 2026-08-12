package com.ksportfolio.expensetracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;


@Getter
@Setter
@Entity
@Table(name = "APP_USER")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @NotNull
    @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    String name;

    @NotNull
    @Column(name = "gender", nullable = false)
    Boolean gender;

    @NotNull
    @Column(name = "dob", nullable = false)
    LocalDate dob;

    @NotNull
    @Size(max = 100)
    @Column(name = "email", nullable = false, length = 100, unique = true)
    String email;

    @NotNull
    @Size(max = 100)
    @Column(name = "password", nullable = false, length = 100)
    String password;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "role", nullable = false)
    Role role;

    @Column(name = "created_by")
    Integer createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    Instant createdAt;

    @Column(name = "modified_by")
    Integer modifiedBy;

    @Column(name = "modified_at")
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    Instant modifiedAt;
}