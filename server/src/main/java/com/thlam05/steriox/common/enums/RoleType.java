package com.thlam05.steriox.common.enums;

public enum RoleType {
    VIEWER,
    ADMIN,
    STREAMER;

    public static boolean contain(String role) {
        return role.equals(RoleType.VIEWER.toString()) || role.equals(RoleType.ADMIN.toString())
                || role.equals(RoleType.STREAMER.toString());
    }
}
