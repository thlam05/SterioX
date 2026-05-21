package com.thlam05.steriox.modules.rbac.controller;

import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.response.ApiResponse;
import com.thlam05.steriox.modules.rbac.dto.request.PermissionRequest;
import com.thlam05.steriox.modules.rbac.dto.response.PermissionResponse;
import com.thlam05.steriox.modules.rbac.service.PermissionService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @GetMapping("/permissions")
    public ApiResponse<List<PermissionResponse>> getAll() {
        var response = permissionService.getAll();
        return new ApiResponse<>(response);
    }

    @PostMapping("/permissions")
    public ApiResponse<PermissionResponse> create(@RequestBody PermissionRequest request) {
        PermissionResponse response = permissionService.create(request);
        return new ApiResponse<>(response);
    }

    @DeleteMapping("/permissions/{name}")
    public ApiResponse<?> delete(@PathVariable String name) {
        permissionService.delete(name);
        return new ApiResponse<>(ResponseStatus.SUCCESS);
    }

}
