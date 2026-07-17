package com.thlam05.steriox.modules.stream.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StreamMessage {
    public static final String USER_NOT_FOUND = "User not found";
    public static final String STREAM_NOT_FOUND = "Stream not found";
    public static final String CAN_ONLY_UPDATE_OWN_STREAMS = "You can only update your own streams";
    public static final String CAN_ONLY_DELETE_OWN_STREAMS = "You can only delete your own streams";
    public static final String STREAM_KEY_NOT_FOUND = "Stream key not found";
    public static final String USER_ID_REQUIRED = "User ID is required";
    public static final String RTMP_BASE_URL = "rtmp://localhost:1935/hls";
}
