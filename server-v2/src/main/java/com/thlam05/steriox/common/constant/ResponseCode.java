package com.thlam05.steriox.common.constant;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ResponseCode {

    // ===== SUCCESS =====
    SUCCESS(
            0,
            "Success",
            HttpStatus.OK),

    // ===== CLIENT ERRORS =====
    BAD_REQUEST(
            1000,
            "Bad request",
            HttpStatus.BAD_REQUEST),

    UNAUTHORIZED(
            1001,
            "Unauthorized",
            HttpStatus.UNAUTHORIZED),

    FORBIDDEN(
            1003,
            "Forbidden",
            HttpStatus.FORBIDDEN),

    NOT_FOUND(
            1004,
            "Not found",
            HttpStatus.NOT_FOUND),

    // ===== AUTH ERRORS =====
    INVALID_USERNAME_OR_PASSWORD(
            2000,
            "Invalid username or password",
            HttpStatus.BAD_REQUEST),

    USER_ALREADY_EXISTS(
            2001,
            "User already exists",
            HttpStatus.BAD_REQUEST),

    // ===== SERVER ERRORS =====
    INTERNAL_SERVER_ERROR(
            5000,
            "Internal server error",
            HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}

