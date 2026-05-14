package com.thlam05.steriox.common.response;

import com.thlam05.steriox.common.enums.ResponseStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;
    private boolean success;

    public ApiResponse(T data) {
        this.code = ResponseStatus.SUCCESS.getCode();
        this.message = ResponseStatus.SUCCESS.getMessage();
        this.data = data;
        this.success = true;
    }

    public ApiResponse(ResponseStatus responseCode) {
        this.code = responseCode.getCode();
        this.message = responseCode.getMessage();
        this.data = null;
        success = false;
        if (responseCode.getCode() == 0) {
            success = true;
        }
    }
}