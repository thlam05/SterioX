package com.thlam05.steriox.modules.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.nimbusds.jose.JOSEException;
import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.dto.ApiResponse;
import com.thlam05.steriox.modules.auth.dto.request.IntrospectRequest;
import com.thlam05.steriox.modules.auth.dto.request.LoginRequest;
import com.thlam05.steriox.modules.auth.dto.request.LogoutRequest;
import com.thlam05.steriox.modules.auth.dto.request.RefreshRequest;
import com.thlam05.steriox.modules.auth.dto.request.RegisterRequest;
import com.thlam05.steriox.modules.auth.dto.response.IntrospectResponse;
import com.thlam05.steriox.modules.auth.dto.response.LoginResponse;
import com.thlam05.steriox.modules.auth.dto.response.TokenResponse;
import com.thlam05.steriox.modules.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

import java.text.ParseException;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @GetMapping("/health")
    public String getMethodName() {
        return "TEST";
    }

    @PostMapping("/auth/login")
    public ApiResponse<LoginResponse> login(@RequestBody LoginRequest request) {
        var response = authService.login(request);
        return new ApiResponse<LoginResponse>(response);
    }

    @PostMapping("/auth/register")
    public ApiResponse<LoginResponse> register(@RequestBody RegisterRequest request) {
        var response = authService.register(request);
        return new ApiResponse<LoginResponse>(response);
    }

    @PostMapping("/auth/logout")
    public ApiResponse<TokenResponse> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authService.logout(request);
        return new ApiResponse<>(ResponseCode.SUCCESS);
    }

    @PostMapping("/auth/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        var response = authService.refresh(request);

        return new ApiResponse<>(response);
    }

    @PostMapping("/auth/introspec")
    public ApiResponse<IntrospectResponse> introspect(
            @RequestBody IntrospectRequest request) {
        var response = authService.introspect(request);
        return new ApiResponse<>(response);
    }
}
