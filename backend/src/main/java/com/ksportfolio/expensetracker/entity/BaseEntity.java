package com.ksportfolio.expensetracker.entity;


import jakarta.persistence.Column;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.Instant;

@Getter
@Setter
@MappedSuperclass
public class BaseEntity {

    /**
     * The timestamp when the entity was created.
     * it's done by hibernate @CreationTimestamp
     * */
    @CreationTimestamp
    @Column(name="created_at",nullable = false,updatable = false)
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    private Instant createdAt;

    /**
     * The timestamp when the entity was last modified.
     * it's done by hibernate @UpdateTimeStamp
     * */
    @UpdateTimestamp
    @Column(name="modified_at",insertable = false)
    @JdbcTypeCode(SqlTypes.TIMESTAMP)
    private Instant modifiedAt;

}
