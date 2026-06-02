package com.thlam05.steriox.modules.stream.entity;

import java.time.LocalDateTime;

import com.thlam05.steriox.modules.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity(name = "stream_keys")
@Table(name = "stream_keys")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreamKey {
    @Id
    @Column(name = "stream_key", nullable = false, unique = true)
    String streamKey;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "stream_url", nullable = false)
    String streamUrl;

    @Column(name = "is_active")
    Boolean isActive;

    @LastModifiedDate
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
