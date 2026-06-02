package com.thlam05.steriox.modules.stream.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.stream.entity.StreamKey;

public interface StreamKeyRepository extends JpaRepository<StreamKey, String> {
    List<StreamKey> findByUserId(String userId);
}
