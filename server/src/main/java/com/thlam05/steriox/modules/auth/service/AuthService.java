package com.thlam05.steriox.modules.auth.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.thlam05.steriox.common.enums.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.common.service.JwtService;
import com.thlam05.steriox.modules.auth.dto.request.LoginRequest;
import com.thlam05.steriox.modules.auth.dto.request.RegisterRequest;
import com.thlam05.steriox.modules.auth.dto.response.TokenResponse;
import com.thlam05.steriox.modules.auth.model.User;
import com.thlam05.steriox.modules.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST);
        }
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already taken");
        }
        User user = User.builder()
                .email(request.getEmail().trim())
                .username(request.getUsername().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepository.save(user);
        return issueToken(user);
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmailIgnoreCase(request.getEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return issueToken(user);
    }

    private TokenResponse issueToken(User user) {
        return TokenResponse.bearer(jwtService.generateAccessToken(user.getId(), user.getUsername()));
    }
}
