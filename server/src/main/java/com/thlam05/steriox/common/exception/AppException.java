package com.thlam05.steriox.common.exception;

import com.thlam05.steriox.common.enums.ResponseStatus;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final ResponseStatus responseStatus;

    public AppException(ResponseStatus responseStatus) {
        super(responseStatus.getMessage());
        this.responseStatus = responseStatus;
    }

    public AppException(
            ResponseStatus responseStatus,
            String customMessage) {
        super(customMessage);
        this.responseStatus = responseStatus;
    }
}