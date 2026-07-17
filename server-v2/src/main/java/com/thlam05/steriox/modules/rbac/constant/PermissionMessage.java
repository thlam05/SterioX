package com.thlam05.steriox.modules.rbac.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class PermissionMessage {
    public static final String INVALID_PERMISSION_FORMAT = "Invalid permission format";
    public static final String PERMISSION_ALREADY_EXISTS = "Permission already exists";
    public static final String PERMISSION_NOT_FOUND = "Permission not found";
}
