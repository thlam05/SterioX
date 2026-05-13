package com.thlam05.steriox.modules.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.modules.auth.dto.request.LoginRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
public class AuthController {
    @PostMapping("/auth/login")
    public String login(@RequestBody LoginRequest request) {
        return "TEST";
    }
}
