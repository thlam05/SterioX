package com.thlam05.steriox.common.exception;

import java.nio.file.AccessDeniedException;

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

        apiResponse.setMessage(exception.getMessage());

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    ResponseEntity<ApiResponse<Void>> handlingMethodArgumentNotValidException(
            MethodArgumentNotValidException exception) {
        ResponseStatus code = ResponseStatus.BAD_REQUEST;
        ApiResponse<Void> apiResponse = new ApiResponse<>(code);

        apiResponse.setMessage(exception.getBindingResult()
                .getFieldError()
                .getDefaultMessage());

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = NoResourceFoundException.class)
    ResponseEntity<ApiResponse<Void>> handlingNoHandlerFoundException(NoResourceFoundException exception) {
        ResponseStatus code = ResponseStatus.NOT_FOUND;
        ApiResponse<Void> apiResponse = new ApiResponse<>(code);

        apiResponse.setMessage(exception.getMessage());

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }

    @ExceptionHandler(value = AccessDeniedException.class)
    ResponseEntity<ApiResponse<Void>> handlingAccessDeniedException(AccessDeniedException exception) {
        ResponseStatus code = ResponseStatus.UNAUTHORIZED;
        ApiResponse<Void> apiResponse = new ApiResponse<>(null);

        apiResponse.setMessage(exception.getMessage());

        return ResponseEntity.status(code.getHttpStatus()).body(apiResponse);
    }
}