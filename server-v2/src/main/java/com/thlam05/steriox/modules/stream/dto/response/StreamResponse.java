package com.thlam05.steriox.modules.stream.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreamResponse {
    String id;
    String userId;
    String username;
    String avatarImageUrl;
    List<CategoryResponse> categories;
    String title;
    String description;
    Boolean isActive;
    Boolean onStream;
    String playUrl;
    String thumbnail;
    Integer totalViews;
    Integer totalLikes;
    LocalDateTime startedAt;
    LocalDateTime endedAt;
    LocalDateTime createdAt;
}
