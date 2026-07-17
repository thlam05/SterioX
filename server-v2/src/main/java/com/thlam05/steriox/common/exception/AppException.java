package com.thlam05.steriox.common.exception;

import com.thlam05.steriox.common.constant.ResponseCode;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final ResponseCode responseCode;

    public AppException(ResponseCode responseCode) {
        super(responseCode.getMessage());
        this.responseCode = responseCode;
    }

    public AppException(
            ResponseCode responseCode,
            String customMessage) {
        super(customMessage);
        this.responseCode = responseCode;
    }
}