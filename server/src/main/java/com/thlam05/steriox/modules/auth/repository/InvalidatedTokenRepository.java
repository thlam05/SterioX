package com.thlam05.steriox.modules.auth.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.auth.entity.InvalidatedToken;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {

}
