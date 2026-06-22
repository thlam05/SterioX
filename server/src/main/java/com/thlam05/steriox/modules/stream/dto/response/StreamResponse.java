package com.thlam05.steriox.modules.stream.dto.response;

import java.time.LocalDateTime;
import java.util.Set;

import com.thlam05.steriox.modules.user.dto.response.UserResponse;

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
    UserResponse user;
    String title;
    String description;
    Boolean isActive;
    Boolean onStream;
    String thumbnail;
    String playUrl;
    Integer totalViews;
    Integer totalLikes;
    LocalDateTime startedAt;
    LocalDateTime endedAt;
    LocalDateTime createdAt;
    Set<CategoryResponse> categories;
}
