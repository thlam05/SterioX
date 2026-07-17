package com.thlam05.steriox.modules.user.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.user.dto.request.CreateUserRequest;
import com.thlam05.steriox.modules.user.dto.request.UpdateUserRequest;
import com.thlam05.steriox.modules.user.dto.response.UserResponse;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.mapper.UserMapper;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @PreAuthorize("hasAuthority('CREATE:USER')")
    public UserResponse create(CreateUserRequest request) {
        validateCreateRequest(request);

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new AppException(ResponseCode.USER_ALREADY_EXISTS, "Email already exists");
        }

        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Username already exists");
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAuthority('READ:USER')")
    public UserResponse getById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "User not found"));
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAuthority('READ:USER')")
    public List<UserResponse> getAll() {
        List<User> users = userRepository.findAll();
        return userMapper.toUserResponses(users);
    }

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String id = authentication.getName();
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "User not found"));
            return userMapper.toUserResponse(user);
        }

        return null;
    }

    public UserResponse getCurrentUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "User not found"));
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAuthority('UPDATE:USER') or authentication.principal.claims['sub'] == #id")
    public UserResponse update(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, "User not found"));

        validateUpdateRequest(request);

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new AppException(ResponseCode.BAD_REQUEST, "Email already exists");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
                throw new AppException(ResponseCode.BAD_REQUEST, "Username already exists");
            }
            user.setUsername(request.getUsername());
        }

        if (request.getAvatarImageUrl() != null) {
            user.setAvatarImageUrl(request.getAvatarImageUrl());
        }

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasAuthority('DELETE:USER')")
    public void delete(String id) {
        if (!userRepository.existsById(id)) {
            throw new AppException(ResponseCode.NOT_FOUND, "User not found");
        }

        userRepository.deleteById(id);
    }

    private void validateCreateRequest(CreateUserRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Username is required");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Email is required");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Password is required");
        }

        if (!isValidEmail(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Invalid email format");
        }
    }

    private void validateUpdateRequest(UpdateUserRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank() && !isValidEmail(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Invalid email format");
        }

        if (request.getUsername() != null && request.getUsername().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, "Username cannot be empty");
        }
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }
}
