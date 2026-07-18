package com.thlam05.steriox.modules.user.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class UserMessage {
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists";
    public static final String USERNAME_ALREADY_EXISTS = "Username already exists";
    public static final String USER_NOT_FOUND = "User not found";
    public static final String CURRENT_PASSWORD_REQUIRED = "Current password is required";
    public static final String NEW_PASSWORD_REQUIRED = "New password is required";
    public static final String CURRENT_PASSWORD_INCORRECT = "Current password is incorrect";
    public static final String USERNAME_REQUIRED = "Username is required";
    public static final String EMAIL_REQUIRED = "Email is required";
    public static final String PASSWORD_REQUIRED = "Password is required";
    public static final String INVALID_EMAIL_FORMAT = "Invalid email format";
    public static final String USERNAME_CANNOT_BE_EMPTY = "Username cannot be empty";
}
