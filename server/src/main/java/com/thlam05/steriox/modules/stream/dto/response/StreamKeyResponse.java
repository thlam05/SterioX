package com.thlam05.steriox.modules.stream.dto.response;

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
public class StreamKeyResponse {
    String streamKey;
    String userId;
    String streamUrl;
    Boolean isActive;
    LocalDateTime updatedAt;
}
