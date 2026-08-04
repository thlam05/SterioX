package com.thlam05.steriox.modules.streamchat.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class ChatMessageMessage {
    public static final String STREAM_NOT_FOUND = "Stream not found";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String MESSAGE_NOT_FOUND = "Chat message not found";
    public static final String CONTENT_REQUIRED = "Content is required";
    public static final String CAN_ONLY_UPDATE_OWN_MESSAGES = "You can only update your own messages";
    public static final String CAN_ONLY_DELETE_OWN_MESSAGES = "You can only delete your own messages";
}
