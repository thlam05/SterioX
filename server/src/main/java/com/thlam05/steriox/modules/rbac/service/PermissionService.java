package com.thlam05.steriox.modules.rbac.service;

import java.util.List;
import java.util.Set;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.rbac.dto.request.PermissionRequest;
import com.thlam05.steriox.modules.rbac.dto.response.PermissionResponse;
import com.thlam05.steriox.modules.rbac.entity.Permission;
import com.thlam05.steriox.modules.rbac.mapper.PermissionMapper;
import com.thlam05.steriox.modules.rbac.repository.PermissionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper;

    private static final Set<String> PERMISSIONS = Set.of(
            "CREATE",
            "READ",
            "UPDATE",
            "DELETE");

    private static final Set<String> ENTITIES = Set.of(
            "USER",
            "ROLE",
            "PERMISSION");

    @PreAuthorize("hasAuthority('READ:PERMISSION')")
    public List<PermissionResponse> getAll() {
        List<Permission> permissions = permissionRepository.findAll();
        return permissionMapper.toPermissionResponses(permissions);
    }

    @PreAuthorize("hasAuthority('CREATE:PERMISSION')")
    public PermissionResponse create(PermissionRequest request) {
        String permissionName = request.getName()
                .trim()
                .toUpperCase();

        if (!validateFormatPermission(permissionName)) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Invalid permission format");
        }

        if (permissionRepository.existsById(permissionName)) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Permission already exists");
        }

        Permission permission = permissionMapper.toPermission(request);
        permission.setName(permissionName);
        permission = permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    @PreAuthorize("hasAuthority('DELETE:PERMISSION')")
    public void delete(String name) {
        if (!permissionRepository.existsById(name)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Permission not found");
        }

        permissionRepository.deleteById(name);
    }

    private boolean validateFormatPermission(String name) {
        if (name == null || name.isBlank()) {
            return false;
        }

        String[] parts = name.trim().toUpperCase().split(":");

        if (parts.length != 2) {
            return false;
        }

        String action = parts[0];
        String entity = parts[1];

        return PERMISSIONS.contains(action)
                && ENTITIES.contains(entity);
    }
}
