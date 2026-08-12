package com.ksportfolio.expensetracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="ROLE")
public class Role {
    @Id
    @Size(max=30)
    @NotNull
    @Column(name="id", nullable = false, length = 30)
    String id;

    @NotNull
    @Size(max = 100)
    @Column(name="name",nullable = false, length = 100)
    String name;
}
