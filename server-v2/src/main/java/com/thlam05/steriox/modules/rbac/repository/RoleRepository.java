package com.thlam05.steriox.modules.rbac.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.rbac.entity.Role;

public interface RoleRepository extends JpaRepository<Role, String> {

}
