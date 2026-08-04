package com.thlam05.steriox.modules.streamchat.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.dto.ApiResponse;
import com.thlam05.steriox.modules.streamchat.dto.request.CreateChatMessageRequest;
import com.thlam05.steriox.modules.streamchat.dto.request.UpdateChatMessageRequest;
import com.thlam05.steriox.modules.streamchat.dto.response.ChatMessageResponse;
import com.thlam05.steriox.modules.streamchat.service.ChatMessageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatMessageController {
    private final ChatMessageService chatMessageService;

    @PostMapping("/streams/{streamId}/chat")
    public ApiResponse<ChatMessageResponse> create(@PathVariable String streamId,
            @RequestBody CreateChatMessageRequest request, Authentication authentication) {
        String userId = authentication.getName();
        ChatMessageResponse response = chatMessageService.create(streamId, userId, request);
        return new ApiResponse<>(response);
    }

    @GetMapping("/streams/{streamId}/chat")
    public ApiResponse<List<ChatMessageResponse>> getAllByStreamId(@PathVariable String streamId) {
        List<ChatMessageResponse> response = chatMessageService.getAllByStreamId(streamId);
        return new ApiResponse<>(response);
    }

    @GetMapping("/streams/{streamId}/chat/{id}")
    public ApiResponse<ChatMessageResponse> getById(@PathVariable String streamId, @PathVariable String id) {
        ChatMessageResponse response = chatMessageService.getById(streamId, id);
        return new ApiResponse<>(response);
    }

    @PutMapping("/streams/{streamId}/chat/{id}")
    public ApiResponse<ChatMessageResponse> update(@PathVariable String streamId, @PathVariable String id,
            @RequestBody UpdateChatMessageRequest request, Authentication authentication) {
        String userId = authentication.getName();
        ChatMessageResponse response = chatMessageService.update(streamId, id, request, userId);
        return new ApiResponse<>(response);
    }

    @DeleteMapping("/streams/{streamId}/chat/{id}")
    public ApiResponse<?> delete(@PathVariable String streamId, @PathVariable String id,
            Authentication authentication) {
        String userId = authentication.getName();
        chatMessageService.delete(streamId, id, userId);
        return new ApiResponse<>(ResponseCode.SUCCESS);
    }
}
