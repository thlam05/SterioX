package com.thlam05.steriox.modules.chat.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.chat.dto.request.CreateChatMessageRequest;
import com.thlam05.steriox.modules.chat.dto.response.ChatMessageResponse;
import com.thlam05.steriox.modules.chat.entity.ChatMessage;
import com.thlam05.steriox.modules.user.dto.response.UserResponse;
import com.thlam05.steriox.modules.user.entity.User;
@Mapper(componentModel = "spring")
public interface ChatMessageMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "stream", ignore = true)
    @Mapping(target = "user", ignore = true)
    ChatMessage toChatMessage(CreateChatMessageRequest request);

    @Mapping(source = "stream.id", target = "streamId")
    ChatMessageResponse toChatMessageResponse(ChatMessage chatMessage);

    List<ChatMessageResponse> toChatMessageResponses(List<ChatMessage> chatMessages);

    
    @Mapping(target = "roles", ignore = true)
    UserResponse toUserResponse(User user);
}