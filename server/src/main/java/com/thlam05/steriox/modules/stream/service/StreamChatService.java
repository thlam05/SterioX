package com.thlam05.steriox.modules.stream.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.common.message.StreamChatMessage;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamChatRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamChatResponse;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.entity.StreamChat;
import com.thlam05.steriox.modules.stream.mapper.StreamChatMapper;
import com.thlam05.steriox.modules.stream.repository.StreamChatRepository;
import com.thlam05.steriox.modules.stream.repository.StreamRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamChatService {
    private final StreamChatRepository streamChatRepository;
    private final StreamRepository streamRepository;
    private final UserRepository userRepository;
    private final StreamChatMapper streamChatMapper;
    private final RabbitTemplate rabbitTemplate;

    @Transactional
    public StreamChatResponse createChat(CreateStreamChatRequest request) {
        if (request.getStreamId() == null || request.getStreamId().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Stream ID is required");
        }
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "User ID is required");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Content is required");
        }

        Stream stream = streamRepository.findById(request.getStreamId())
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not found"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "User not found"));

        StreamChat streamChat = StreamChat.builder()
                .stream(stream)
                .user(user)
                .content(request.getContent())
                .isPinned(false)
                .isToxic(false)
                .build();

        StreamChatResponse response = streamChatMapper.toStreamChatResponse(streamChatRepository.save(streamChat));

        StreamChatMessage message = StreamChatMessage.builder()
                .chatId(response.getId())
                .streamId(response.getStreamId())
                .userId(response.getUser().getId())
                .username(response.getUser().getUsername())
                .content(response.getContent())
                .timestamp(LocalDateTime.now())
                .build();

        rabbitTemplate.convertAndSend("steriox.topic", "chat." + request.getStreamId(), message);

        return response;
    }

    public List<StreamChatResponse> getChatsByStreamId(String streamId) {
        if (!streamRepository.existsById(streamId)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Stream not found");
        }
        List<StreamChat> chats = streamChatRepository.findByStreamIdOrderByCreatedAtAsc(streamId);
        return streamChatMapper.toStreamChatResponses(chats);
    }

    @Transactional
    public StreamChatResponse togglePin(String id, boolean pin) {
        StreamChat streamChat = streamChatRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Chat message not found"));
        streamChat.setIsPinned(pin);
        return streamChatMapper.toStreamChatResponse(streamChatRepository.save(streamChat));
    }

    @Transactional
    public StreamChatResponse toggleToxic(String id, boolean toxic) {
        StreamChat streamChat = streamChatRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Chat message not found"));
        streamChat.setIsToxic(toxic);
        return streamChatMapper.toStreamChatResponse(streamChatRepository.save(streamChat));
    }
}
