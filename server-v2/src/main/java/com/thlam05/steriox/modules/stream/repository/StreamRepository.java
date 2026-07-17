package com.thlam05.steriox.modules.stream.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.stream.entity.Stream;

public interface StreamRepository extends JpaRepository<Stream, String> {
    List<Stream> findByUserId(String userId);
}
