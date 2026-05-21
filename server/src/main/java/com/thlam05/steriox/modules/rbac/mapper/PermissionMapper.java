package com.thlam05.steriox.modules.rbac.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.thlam05.steriox.modules.rbac.dto.request.PermissionRequest;
import com.thlam05.steriox.modules.rbac.dto.response.PermissionResponse;
import com.thlam05.steriox.modules.rbac.entity.Permission;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);

    List<PermissionResponse> toPermissionResponses(List<Permission> permissions);
}
