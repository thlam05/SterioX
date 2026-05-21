package com.thlam05.steriox.modules.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.auth.dto.request.LoginRequest;
import com.thlam05.steriox.modules.auth.dto.request.RegisterRequest;
import com.thlam05.steriox.modules.auth.dto.response.TokenResponse;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;
import com.thlam05.steriox.security.service.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public TokenResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Email already exists.");
        }
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Username already exists.");
        }
        User user = User.builder()
                .email(request.getEmail().trim())
                .username(request.getUsername().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                // .roles(Set.of(new Role(RoleType.VIEWER.toString())))
                .avatarImageUrl("https://source.unsplash.com/random/800x600")
                .build();
        userRepository.save(user);
        return issueToken(user);
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new AppException(ResponseStatus.INVALID_USERNAME_OR_PASSWORD));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ResponseStatus.INVALID_USERNAME_OR_PASSWORD);
        }
        return issueToken(user);
    }

    private TokenResponse issueToken(User user) {
        return TokenResponse.bearer(jwtService.generateAccessToken(user));
    }
}
