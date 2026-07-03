package com.thlam05.steriox.modules.stream.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.thlam05.steriox.modules.stream.entity.StreamChat;

@Repository
public interface StreamChatRepository extends JpaRepository<StreamChat, String> {
    List<StreamChat> findByStreamIdOrderByCreatedAtAsc(String streamId);
}
