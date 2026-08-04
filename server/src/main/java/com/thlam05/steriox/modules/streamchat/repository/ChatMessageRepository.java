package com.thlam05.steriox.modules.streamchat.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.thlam05.steriox.modules.streamchat.entity.ChatMessage;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {
    List<ChatMessage> findByStreamId(String streamId);
}
