package com.thlam05.steriox.modules.stream.entity;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.thlam05.steriox.common.model.BaseModel;
import com.thlam05.steriox.modules.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity(name = "stream_keys")
@Table(name = "stream_keys")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class StreamKey extends BaseModel {
    @Id
    @Column(name = "stream_key", nullable = false, unique = true)
    private String streamKey;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "stream_url", nullable = false)
    private String streamUrl;
}
