package com.thlam05.steriox.modules.rbac.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.dto.ApiResponse;
import com.thlam05.steriox.modules.rbac.dto.request.RoleRequest;
import com.thlam05.steriox.modules.rbac.dto.request.UpdateRoleRequest;
import com.thlam05.steriox.modules.rbac.dto.response.RoleResponse;
import com.thlam05.steriox.modules.rbac.service.RoleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("/roles")
    public ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request) {
        RoleResponse response = roleService.create(request);
        return new ApiResponse<>(response);
    }

    @GetMapping("/roles")
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        List<RoleResponse> roles = roleService.getAll();
        return new ApiResponse<>(roles);
    }

    @DeleteMapping("/roles/{name}")
    public ApiResponse<Void> deleteRole(@PathVariable String name) {
        roleService.delete(name);
        return new ApiResponse<>(ResponseCode.SUCCESS);
    }

    @PutMapping("/roles/{name}")
    public ApiResponse<RoleResponse> updateRole(@PathVariable String name, @RequestBody UpdateRoleRequest request) {
        RoleResponse response = roleService.update(name, request);
        return new ApiResponse<>(response);
    }
}
