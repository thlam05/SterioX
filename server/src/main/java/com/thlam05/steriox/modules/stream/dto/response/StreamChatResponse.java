package com.thlam05.steriox.modules.stream.dto.response;

import java.time.LocalDateTime;

import com.thlam05.steriox.modules.user.dto.response.UserResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StreamChatResponse {
    String id;
    String streamId;
    UserResponse user;
    String content;
    Boolean isPinned;
    Boolean isToxic;
    LocalDateTime createdAt;
}
