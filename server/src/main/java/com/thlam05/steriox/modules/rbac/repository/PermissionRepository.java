package com.thlam05.steriox.modules.rbac.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.rbac.entity.Permission;

public interface PermissionRepository extends JpaRepository<Permission, String> {

}
