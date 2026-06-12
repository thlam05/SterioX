package com.thlam05.steriox.modules.stream.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

import com.thlam05.steriox.modules.user.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreamResponse {
    String id;
    User user;
    String title;
    String description;
    String status;
    Boolean isActive;
    Boolean onStream;
    String thumbnail;
    String playUrl;
    String latency;
    boolean dvr;
    boolean vod;
    Integer totalViews;
    Integer totalLikes;
    LocalDateTime startedAt;
    LocalDateTime endedAt;
    LocalDateTime createdAt;
    Set<CategoryResponse> categories;
}
