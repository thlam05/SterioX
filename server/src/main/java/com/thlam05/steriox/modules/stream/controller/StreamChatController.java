package com.thlam05.steriox.modules.stream.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.response.ApiResponse;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamChatRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamChatResponse;
import com.thlam05.steriox.modules.stream.service.StreamChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stream-chats")
@RequiredArgsConstructor
public class StreamChatController {
    private final StreamChatService streamChatService;

    @PostMapping
    public ApiResponse<StreamChatResponse> createChat(@RequestBody CreateStreamChatRequest request) {
        return new ApiResponse<>(streamChatService.createChat(request));
    }

    @GetMapping("/stream/{streamId}")
    public ApiResponse<List<StreamChatResponse>> getChatsByStreamId(@PathVariable String streamId) {
        return new ApiResponse<>(streamChatService.getChatsByStreamId(streamId));
    }

    @PatchMapping("/{id}/pin")
    public ApiResponse<StreamChatResponse> togglePin(@PathVariable String id, @RequestParam boolean pin) {
        return new ApiResponse<>(streamChatService.togglePin(id, pin));
    }

    @PatchMapping("/{id}/toxic")
    public ApiResponse<StreamChatResponse> toggleToxic(@PathVariable String id, @RequestParam boolean toxic) {
        return new ApiResponse<>(streamChatService.toggleToxic(id, toxic));
    }
}
