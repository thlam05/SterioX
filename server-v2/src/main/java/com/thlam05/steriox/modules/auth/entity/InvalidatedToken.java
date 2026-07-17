package com.thlam05.steriox.modules.auth.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "invalidated_tokens")
@Table(name = "invalidated_tokens")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class InvalidatedToken {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "expire_at")
    private Date expireAt;
}
