package com.ksportfolio.expensetracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;


@Entity
@Table(name="CATEGORY")
public class Category extends BaseEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id",nullable = false,updatable = false)
    private Integer id;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", nullable = false , length = 50)
    private String name;

    @Size(max = 300)
    @Column(name = "description" , length = 300)
    private String description;

    @Size(max = 50)
    @Column(name = "icon" , length = 50)
    private String icon;

    @NotNull
    @Column(name="type", nullable = false)
    private Boolean isIncome;

    @NotNull
    @Column(name="isUniversal", nullable = false)
    private Boolean isUniversal;

    @NotNull
    @Column(name="isActive", nullable = false)
    private Boolean isActive;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name="user_id")
    private AppUser user;

}
