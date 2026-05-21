package com.thlam05.steriox.modules.rbac.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thlam05.steriox.modules.rbac.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

}
