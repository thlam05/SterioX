package com.thlam05.steriox.modules.stream.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.thlam05.steriox.modules.stream.entity.StreamKey;

public interface StreamKeyRepository extends JpaRepository<StreamKey, String> {
    @Query("""
            SELECT sk FROM stream_keys sk
            WHERE sk.user.id = :userId
            """)
    Optional<StreamKey> findByUserId(String userId);
}
