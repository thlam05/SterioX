package com.thlam05.steriox.modules.chat.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.chat.constant.ChatMessageMessage;
import com.thlam05.steriox.modules.chat.dto.request.CreateChatMessageRequest;
import com.thlam05.steriox.modules.chat.dto.request.UpdateChatMessageRequest;
import com.thlam05.steriox.modules.chat.dto.response.ChatMessageResponse;
import com.thlam05.steriox.modules.chat.entity.ChatMessage;
import com.thlam05.steriox.modules.chat.mapper.ChatMessageMapper;
import com.thlam05.steriox.modules.chat.repository.ChatMessageRepository;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.repository.StreamRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatMessageMapper chatMessageMapper;
    private final StreamRepository streamRepository;
    private final UserRepository userRepository;

    public ChatMessageResponse create(String streamId, String userId, CreateChatMessageRequest request) {
        validateCreateRequest(request);

        Stream stream = streamRepository.findById(streamId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, ChatMessageMessage.STREAM_NOT_FOUND));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, ChatMessageMessage.USER_NOT_FOUND));

        ChatMessage chatMessage = chatMessageMapper.toChatMessage(request);
        chatMessage.setStream(stream);
        chatMessage.setUser(user);

        chatMessage = chatMessageRepository.save(chatMessage);
        return chatMessageMapper.toChatMessageResponse(chatMessage);
    }

    public ChatMessageResponse getById(String streamId, String id) {
        ChatMessage chatMessage = findByIdAndStream(id, streamId);
        return chatMessageMapper.toChatMessageResponse(chatMessage);
    }

    public List<ChatMessageResponse> getAllByStreamId(String streamId) {
        if (!streamRepository.existsById(streamId)) {
            throw new AppException(ResponseCode.NOT_FOUND, ChatMessageMessage.STREAM_NOT_FOUND);
        }
        List<ChatMessage> chatMessages = chatMessageRepository.findByStreamId(streamId);
        return chatMessageMapper.toChatMessageResponses(chatMessages);
    }

    public ChatMessageResponse update(String streamId, String id, UpdateChatMessageRequest request, String userId) {
        ChatMessage chatMessage = findByIdAndStream(id, streamId);

        if (!chatMessage.getUser().getId().equals(userId)) {
            throw new AppException(ResponseCode.FORBIDDEN, ChatMessageMessage.CAN_ONLY_UPDATE_OWN_MESSAGES);
        }

        validateUpdateRequest(request);

        if (request.getContent() != null) {
            chatMessage.setContent(request.getContent());
        }

        chatMessage = chatMessageRepository.save(chatMessage);
        return chatMessageMapper.toChatMessageResponse(chatMessage);
    }

    public void delete(String streamId, String id, String userId) {
        ChatMessage chatMessage = findByIdAndStream(id, streamId);

        if (!chatMessage.getUser().getId().equals(userId)) {
            throw new AppException(ResponseCode.FORBIDDEN, ChatMessageMessage.CAN_ONLY_DELETE_OWN_MESSAGES);
        }

        chatMessageRepository.delete(chatMessage);
    }

    private ChatMessage findByIdAndStream(String id, String streamId) {
        ChatMessage chatMessage = chatMessageRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, ChatMessageMessage.MESSAGE_NOT_FOUND));

        if (!chatMessage.getStream().getId().equals(streamId)) {
            throw new AppException(ResponseCode.NOT_FOUND, ChatMessageMessage.MESSAGE_NOT_FOUND);
        }
        return chatMessage;
    }

    private void validateCreateRequest(CreateChatMessageRequest request) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, ChatMessageMessage.CONTENT_REQUIRED);
        }
    }

    private void validateUpdateRequest(UpdateChatMessageRequest request) {
        if (request.getContent() != null && request.getContent().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, ChatMessageMessage.CONTENT_REQUIRED);
        }
    }
}
