package com.thlam05.steriox.modules.user.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.dto.ApiResponse;
import com.thlam05.steriox.modules.user.dto.request.CreateUserRequest;
import com.thlam05.steriox.modules.user.dto.request.UpdateUserRequest;
import com.thlam05.steriox.modules.user.dto.response.UserResponse;
import com.thlam05.steriox.modules.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/users")
    public ApiResponse<UserResponse> create(@RequestBody CreateUserRequest request) {
        UserResponse response = userService.create(request);
        return new ApiResponse<>(response);
    }

    @GetMapping("/users")
    public ApiResponse<List<UserResponse>> getAll() {
        List<UserResponse> response = userService.getAll();
        return new ApiResponse<>(response);
    }

    @GetMapping("/users/me")
    public ApiResponse<UserResponse> getCurrentUser() {
        UserResponse response = userService.getCurrentUser();
        return new ApiResponse<>(response);
    }

    @GetMapping("/users/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable String id) {
        UserResponse response = userService.getById(id);
        return new ApiResponse<>(response);
    }

    @PutMapping("/users/{id}")
    public ApiResponse<UserResponse> update(@PathVariable String id, @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.update(id, request);
        return new ApiResponse<>(response);
    }

    @DeleteMapping("/users/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        userService.delete(id);
        return new ApiResponse<>(ResponseCode.SUCCESS);
    }
}
