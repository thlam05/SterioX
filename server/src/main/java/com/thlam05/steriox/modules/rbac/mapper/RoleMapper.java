package com.thlam05.steriox.modules.rbac.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.rbac.dto.request.RoleRequest;
import com.thlam05.steriox.modules.rbac.dto.response.RoleResponse;
import com.thlam05.steriox.modules.rbac.entity.Role;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    default RoleResponse toRoleResponse(Role role) {
        if (role == null) {
            return null;
        }
        RoleResponse response = new RoleResponse();
        response.setName(role.getName());
        response.setPermissions(
                role.getPermissions() != null
                        ? role.getPermissions().stream()
                                .map(p -> p.getName())
                                .collect(Collectors.toList())
                        : null);
        return response;
    }

    default List<RoleResponse> toRoleResponses(List<Role> roles) {
        if (roles == null) {
            return null;
        }
        return roles.stream()
                .map(this::toRoleResponse)
                .collect(Collectors.toList());
    }
}
