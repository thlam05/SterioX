package com.thlam05.steriox.modules.auth.dto.response;

import com.thlam05.steriox.modules.user.dto.response.UserResponse;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LoginResponse {
    String token;
    UserResponse user;
}
