package com.thlam05.steriox.modules.user.service;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.user.constant.UserMessage;
import com.thlam05.steriox.modules.user.dto.request.ChangePasswordRequest;
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
            throw new AppException(ResponseCode.USER_ALREADY_EXISTS, UserMessage.EMAIL_ALREADY_EXISTS);
        }

        if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_ALREADY_EXISTS);
        }

        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    // @PreAuthorize("hasAuthority('READ:USER')")
    public UserResponse getById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    // @PreAuthorize("hasAuthority('READ:USER')")
    public List<UserResponse> getAll() {
        List<User> users = userRepository.findAll();
        return userMapper.toUserResponses(users);
    }

    public UserResponse getCurrentUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }

    public UserResponse updateProfile(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));

        validateUpdateRequest(request);

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_ALREADY_EXISTS);
            }
            user.setUsername(request.getUsername());
        }

        if (request.getAvatarImageUrl() != null) {
            user.setAvatarImageUrl(request.getAvatarImageUrl());
        }

        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

    public void changePassword(String id, ChangePasswordRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));

        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.CURRENT_PASSWORD_REQUIRED);
        }

        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.NEW_PASSWORD_REQUIRED);
        }

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.CURRENT_PASSWORD_INCORRECT);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @PreAuthorize("hasAuthority('UPDATE:USER') or authentication.principal.claims['sub'] == #id")
    public UserResponse update(String id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND));

        validateUpdateRequest(request);

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.EMAIL_ALREADY_EXISTS);
            }
            user.setEmail(request.getEmail());
        }

        if (request.getUsername() != null && !request.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
                throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_ALREADY_EXISTS);
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
            throw new AppException(ResponseCode.NOT_FOUND, UserMessage.USER_NOT_FOUND);
        }

        userRepository.deleteById(id);
    }

    private void validateCreateRequest(CreateUserRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_REQUIRED);
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.EMAIL_REQUIRED);
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.PASSWORD_REQUIRED);
        }

        if (!isValidEmail(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.INVALID_EMAIL_FORMAT);
        }
    }

    private void validateUpdateRequest(UpdateUserRequest request) {
        if (request.getEmail() != null && !request.getEmail().isBlank() && !isValidEmail(request.getEmail())) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.INVALID_EMAIL_FORMAT);
        }

        if (request.getUsername() != null && request.getUsername().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, UserMessage.USERNAME_CANNOT_BE_EMPTY);
        }
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    }
}
