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
    public static final String CATEGORY_NOT_FOUND = "Category not found";
    public static final String CATEGORY_REQUEST_REQUIRED = "Category request is required";
    public static final String PARENT_CATEGORY_NOT_FOUND = "Parent category is not found";
    public static final String CATEGORY_NAME_REQUIRED = "Category name is required";
    public static final String CATEGORY_SLUG_REQUIRED = "Category slug is required";
    public static final String CATEGORY_LEVEL_NON_NEGATIVE = "Category level must not be negative";
    public static final String CATEGORY_UPDATE_REQUEST_REQUIRED = "Category update request is required";
    public static final String CATEGORY_NAME_NOT_BLANK = "Category name must not be blank";
    public static final String CATEGORY_SLUG_NOT_BLANK = "Category slug must not be blank";
}
