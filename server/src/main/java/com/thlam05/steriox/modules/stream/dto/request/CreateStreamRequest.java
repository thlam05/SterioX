package com.thlam05.steriox.modules.stream.dto.request;

import java.time.LocalDateTime;

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
public class CreateStreamRequest {
    String userId;
    String title;
    String description;
    String status;
    String thumbnail;
    LocalDateTime scheduledAt;
    LocalDateTime startedAt;
    LocalDateTime endedAt;
}
