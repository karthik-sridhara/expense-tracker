package com.ksportfolio.expensetracker.entity;


import jakarta.persistence.Column;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Getter
@MappedSuperclass
public class BaseEntity {

    @CreationTimestamp
    @Column(name="created_at",nullable = false,updatable = false)
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name="modified_at",insertable = false)
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    private Instant modifiedAt;

}
