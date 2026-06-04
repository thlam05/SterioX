package com.thlam05.steriox.modules.stream.entity;

import java.time.LocalDateTime;

import com.thlam05.steriox.common.model.BaseModel;
import com.thlam05.steriox.modules.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity(name = "streams")
@Table(name = "streams")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Stream extends BaseModel {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @Column(name = "title", nullable = false)
    String title;

    @Column(name = "description")
    String description;

    @Column(name = "status", length = 20)
    String status;

    @Column(name = "is_active")
    Boolean isActive;

    @Column(name = "play_url")
    String playUrl;

    @Column(name = "thumbnail")
    String thumbnail;

    @Column(name = "latency")
    String latency;

    @Column(name = "dvr")
    boolean dvr;

    @Column(name = "vod")
    boolean vod;

    @Column(name = "current_viewers")
    Integer currentViewers;

    @Column(name = "max_viewers")
    Integer maxViewers;

    @Column(name = "total_likes")
    Integer totalLikes;

    @Column(name = "started_at")
    LocalDateTime startedAt;

    @Column(name = "ended_at")
    LocalDateTime endedAt;
}
