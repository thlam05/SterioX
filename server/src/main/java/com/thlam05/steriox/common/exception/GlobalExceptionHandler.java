package com.thlam05.steriox.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.response.ApiResponse;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(value = AppException.class)
    ResponseEntity<ApiResponse<Void>> handlingAppException(AppException exception) {
        ResponseStatus code = exception.getResponseStatus();
        if (code == null) {
            code = ResponseStatus.INTERNAL_SERVER_ERROR;
        }
        ApiResponse<Void> apiResponse = new ApiResponse<>(code);

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = Exception.class)
    ResponseEntity<ApiResponse<Void>> handlingAppException(Exception exception) {
        ResponseStatus code = ResponseStatus.INTERNAL_SERVER_ERROR;
        ApiResponse<Void> apiResponse = new ApiResponse<>(code);

        apiResponse.setCode(code.getCode());
        apiResponse.setMessage(exception.getMessage());

        boolean success = false;
        if (code.getCode() == 0) {
            success = true;
        }
        apiResponse.setSuccess(success);

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> handlingMethodArgumentNotValidException(
            MethodArgumentNotValidException exception) {
        ResponseStatus code = ResponseStatus.BAD_REQUEST;
        ApiResponse<Void> apiResponse = new ApiResponse<>(null);

        apiResponse.setCode(code.getCode());
        apiResponse.setMessage(exception.getBindingResult()
                .getFieldError()
                .getDefaultMessage());

        boolean success = false;
        if (code.getCode() == 0) {
            success = true;
        }
        apiResponse.setSuccess(success);

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = NoResourceFoundException.class)
    ResponseEntity<ApiResponse<Void>> handlingNoHandlerFoundException(NoResourceFoundException exception) {
        ResponseStatus code = ResponseStatus.NOT_FOUND;
        ApiResponse<Void> apiResponse = new ApiResponse<>(null);

        apiResponse.setCode(code.getCode());
        apiResponse.setMessage(code.getMessage() + " endpoint");

        boolean success = false;
        if (code.getCode() == 0) {
            success = true;
        }
        apiResponse.setSuccess(success);

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }
}