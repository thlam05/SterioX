package com.thlam05.steriox.modules.auth.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AuthMessage {
    public static final String EMAIL_ALREADY_EXISTS = "Email already exists.";
    public static final String USERNAME_ALREADY_EXISTS = "Username already exists.";
    public static final String ROLE_NOT_FOUND = "Role not found";
    public static final String LOGOUT_ERROR_PREFIX = "Error when logging out: ";
    public static final String INVALID_USERNAME_OR_PASSWORD = "Invalid username or password";
}
