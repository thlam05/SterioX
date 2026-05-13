package com.thlam05.steriox.common.enums;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ResponseCode {
    SUCCESS(0, "Successfully", HttpStatus.OK),
    BAD_REQUEST(1, "Bad request", HttpStatus.BAD_REQUEST),
    NOT_FOUND(4, "Can not find", HttpStatus.NOT_FOUND),
    INTERNAL_SERVER_ERROR(5, "Server is error", HttpStatus.INTERNAL_SERVER_ERROR),

    BAD_LOGIN_REQUEST(6, "Username or password is wrong", HttpStatus.BAD_REQUEST),
    USER_ALREADY_EXISTS(7, "Username already exists", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus status;
}
