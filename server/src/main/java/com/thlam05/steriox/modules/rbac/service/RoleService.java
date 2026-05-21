package com.thlam05.steriox.modules.rbac.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.rbac.dto.request.RoleRequest;
import com.thlam05.steriox.modules.rbac.dto.request.UpdateRoleRequest;
import com.thlam05.steriox.modules.rbac.dto.response.RoleResponse;
import com.thlam05.steriox.modules.rbac.entity.Permission;
import com.thlam05.steriox.modules.rbac.entity.Role;
import com.thlam05.steriox.modules.rbac.mapper.RoleMapper;
import com.thlam05.steriox.modules.rbac.repository.PermissionRepository;
import com.thlam05.steriox.modules.rbac.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final RoleMapper roleMapper;

    public RoleResponse create(RoleRequest request) {
        String roleName = request.getName()
                .trim();

        if (!isValidRoleName(roleName)) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Invalid role name");
        }

        if (roleRepository.existsById(roleName)) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Role already exists");
        }

        if (request.getPermissions() == null || request.getPermissions().isEmpty()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Role must have at least one permission");
        }

        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(request.getPermissions()));
        if (permissions.size() != request.getPermissions().size()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Some permissions not found");
        }

        Role role = roleMapper.toRole(request);
        role.setName(roleName);
        role.setPermissions(permissions);

        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    public List<RoleResponse> getAll() {
        List<Role> roles = roleRepository.findAll();
        return roleMapper.toRoleResponses(roles);
    }

    public void delete(String roleName) {
        if (!roleRepository.existsById(roleName)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Role not found");
        }

        roleRepository.deleteById(roleName);
    }

    public RoleResponse update(String roleName, UpdateRoleRequest request) {
        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Role not found"));

        if (request.getPermissions() == null || request.getPermissions().isEmpty()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Role must have at least one permission");
        }

        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(request.getPermissions()));
        if (permissions.size() != request.getPermissions().size()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Some permissions not found");
        }

        role.setPermissions(permissions);
        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    private boolean isValidRoleName(String name) {
        return name != null && !name.isBlank();
    }
}
