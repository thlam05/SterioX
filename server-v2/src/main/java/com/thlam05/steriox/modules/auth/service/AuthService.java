package com.thlam05.steriox.modules.auth.service;

import java.text.ParseException;
import java.util.Date;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.auth.dto.request.IntrospectRequest;
import com.thlam05.steriox.modules.auth.dto.request.LoginRequest;
import com.thlam05.steriox.modules.auth.dto.request.LogoutRequest;
import com.thlam05.steriox.modules.auth.dto.request.RefreshRequest;
import com.thlam05.steriox.modules.auth.dto.request.RegisterRequest;
import com.thlam05.steriox.modules.auth.dto.response.IntrospectResponse;
import com.thlam05.steriox.modules.auth.dto.response.LoginResponse;
import com.thlam05.steriox.modules.auth.dto.response.TokenResponse;
import com.thlam05.steriox.modules.auth.entity.InvalidatedToken;
import com.thlam05.steriox.modules.auth.repository.InvalidatedTokenRepository;
import com.thlam05.steriox.modules.rbac.constant.RoleType;
import com.thlam05.steriox.modules.rbac.repository.RoleRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.mapper.UserMapper;
import com.thlam05.steriox.modules.user.repository.UserRepository;
import com.thlam05.steriox.security.util.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final InvalidatedTokenRepository invalidatedTokenRepository;
    private final UserMapper userMapper;

    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Email already exists.");
        }
        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Username already exists.");
        }
        User user = User.builder()
                .email(request.getEmail().trim())
                .username(request.getUsername().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(roleRepository.findById(RoleType.VIEWER.name())
                        .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "Role not found"))))
                .avatarImageUrl("https://picsum.photos/400/400")
                .build();
        userRepository.save(user);
        String token = jwtService.generateAccessToken(user);
        return new LoginResponse(token, userMapper.toUserResponse(user));
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmail(request.getEmail().trim())
                .orElseThrow(() -> new AppException(ResponseCode.INVALID_USERNAME_OR_PASSWORD));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ResponseCode.INVALID_USERNAME_OR_PASSWORD);
        }
        String token = jwtService.generateAccessToken(user);
        return new LoginResponse(token, userMapper.toUserResponse(user));
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        SignedJWT signedJWT = jwtService.verify(request.getToken(), true);
        try {
            String tokenId = signedJWT.getJWTClaimsSet().getJWTID();
            Date expireAt = signedJWT.getJWTClaimsSet().getExpirationTime();

            InvalidatedToken invalidatedToken = InvalidatedToken.builder()
                    .id(tokenId)
                    .expireAt(expireAt)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (Exception e) {
            throw new AppException(ResponseCode.INTERNAL_SERVER_ERROR, "Error when logging out: " + e.getMessage());
        }
    }

    public TokenResponse refresh(RefreshRequest request) throws ParseException, JOSEException {
        String token = jwtService.refreshToken(request.getToken());
        return TokenResponse.bearer(token);
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        boolean valid = jwtService.introspect(request.getToken());
        return new IntrospectResponse(valid);
    }
}