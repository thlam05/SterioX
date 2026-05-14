package com.thlam05.steriox.modules.auth.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.response.ApiResponse;
import com.thlam05.steriox.modules.auth.dto.request.LoginRequest;
import com.thlam05.steriox.modules.auth.dto.request.RegisterRequest;
import com.thlam05.steriox.modules.auth.dto.response.TokenResponse;
import com.thlam05.steriox.modules.auth.service.AuthService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/health")
    public String getMethodName() {
        return "TEST";
    }

    @PostMapping("/auth/login")
    public ApiResponse<TokenResponse> login(@RequestBody LoginRequest request) {
        var response = authService.login(request);
        return new ApiResponse<TokenResponse>(response);
    }

    @PostMapping("/auth/register")
    public ApiResponse<TokenResponse> register(@RequestBody RegisterRequest request) {
        var response = authService.register(request);
        return new ApiResponse<TokenResponse>(response);
    }
}
