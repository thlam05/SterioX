package com.thlam05.steriox.modules.rbac.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.rbac.constant.RoleMessage;
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

    @PreAuthorize("hasAuthority('CREATE:ROLE')")
    public RoleResponse create(RoleRequest request) {
        String roleName = request.getName()
                .trim();

        if (!isValidRoleName(roleName)) {
            throw new AppException(ResponseCode.BAD_REQUEST, RoleMessage.INVALID_ROLE_NAME);
        }

        if (roleRepository.existsById(roleName)) {
            throw new AppException(ResponseCode.BAD_REQUEST, RoleMessage.ROLE_ALREADY_EXISTS);
        }

        if (request.getPermissions() == null || request.getPermissions().isEmpty()) {
            throw new AppException(ResponseCode.BAD_REQUEST, RoleMessage.ROLE_MUST_HAVE_PERMISSION);
        }

        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(request.getPermissions()));
        if (permissions.size() != request.getPermissions().size()) {
            throw new AppException(ResponseCode.BAD_REQUEST, RoleMessage.SOME_PERMISSIONS_NOT_FOUND);
        }

        Role role = roleMapper.toRole(request);
        role.setName(roleName);
        role.setPermissions(permissions);

        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    @PreAuthorize("hasAuthority('READ:ROLE')")
    public List<RoleResponse> getAll() {
        List<Role> roles = roleRepository.findAll();
        return roleMapper.toRoleResponses(roles);
    }

    @PreAuthorize("hasAuthority('DELETE:ROLE')")
    public void delete(String roleName) {
        if (!roleRepository.existsById(roleName)) {
            throw new AppException(ResponseCode.NOT_FOUND, RoleMessage.ROLE_NOT_FOUND);
        }

        roleRepository.deleteById(roleName);
    }

    @PreAuthorize("hasAuthority('UPDATE:ROLE')")
    public RoleResponse update(String roleName, UpdateRoleRequest request) {
        Role role = roleRepository.findById(roleName)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, RoleMessage.ROLE_NOT_FOUND));

        if (request.getPermissions() == null || request.getPermissions().isEmpty()) {
            throw new AppException(ResponseCode.BAD_REQUEST, RoleMessage.ROLE_MUST_HAVE_PERMISSION);
        }

        Set<Permission> permissions = new HashSet<>(permissionRepository.findAllById(request.getPermissions()));
        if (permissions.size() != request.getPermissions().size()) {
            throw new AppException(ResponseCode.BAD_REQUEST, RoleMessage.SOME_PERMISSIONS_NOT_FOUND);
        }

        role.setPermissions(permissions);
        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    private boolean isValidRoleName(String name) {
        return name != null && !name.isBlank();
    }
}
