package com.ksportfolio.expensetracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
@Table(name = "APP_USER")
public class AppUser extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
    private Integer id;

    @NotNull
    @Size(max = 100)
    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @NotNull
    @Size(max = 100)
    @Column(name = "password", nullable = false, length = 100)
    private String password;

    @NotNull
    @Column(name="reset_password", nullable = false)
    private Boolean passwordExpired;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role", nullable = false)
    private Role role;
}