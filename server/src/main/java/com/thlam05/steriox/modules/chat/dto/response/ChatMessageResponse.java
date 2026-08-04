package com.thlam05.steriox.modules.chat.dto.response;

import java.time.LocalDateTime;

import com.thlam05.steriox.modules.user.dto.response.UserResponse;

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
public class ChatMessageResponse {
    String id;
    String streamId;
    UserResponse user;
    String content;
    LocalDateTime createdAt;
}
