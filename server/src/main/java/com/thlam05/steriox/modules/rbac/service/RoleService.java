package com.thlam05.steriox.modules.rbac.service;

import org.springframework.stereotype.Service;

import com.thlam05.steriox.modules.rbac.dto.request.RoleRequest;
import com.thlam05.steriox.modules.rbac.dto.response.RoleResponse;
import com.thlam05.steriox.modules.rbac.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleResponse create(RoleRequest request) {
        return null;
    }
}
