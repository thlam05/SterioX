package com.thlam05.steriox.modules.user.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.user.dto.request.CreateUserRequest;
import com.thlam05.steriox.modules.user.dto.response.UserResponse;
import com.thlam05.steriox.modules.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toUser(CreateUserRequest request);

    default UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setAvatarImageUrl(user.getAvatarImageUrl());
        response.setRoles(
                user.getRoles() != null
                        ? user.getRoles().stream()
                                .map(r -> r.getName())
                                .collect(Collectors.toList())
                        : null);
        return response;
    }

    default List<UserResponse> toUserResponses(List<User> users) {
        if (users == null) {
            return null;
        }
        return users.stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }
}
