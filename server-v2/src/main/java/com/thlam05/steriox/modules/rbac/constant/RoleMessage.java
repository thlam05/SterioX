package com.thlam05.steriox.modules.rbac.constant;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleMessage {
    public static final String INVALID_ROLE_NAME = "Invalid role name";
    public static final String ROLE_ALREADY_EXISTS = "Role already exists";
    public static final String ROLE_MUST_HAVE_PERMISSION = "Role must have at least one permission";
    public static final String SOME_PERMISSIONS_NOT_FOUND = "Some permissions not found";
    public static final String ROLE_NOT_FOUND = "Role not found";
}
