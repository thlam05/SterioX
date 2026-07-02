package com.thlam05.steriox.modules.stream.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.thlam05.steriox.modules.stream.dto.request.HeartbeatMessage;
import com.thlam05.steriox.modules.stream.service.StreamService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class StreamSocketController {
    private final StreamService streamService;

    @MessageMapping("/view-livestream/{streamId}")
    public void handleViewLivestream(@DestinationVariable String streamId, HeartbeatMessage message) {
        streamService.handleViewHeartbeat(streamId, message.getUserId());
    }
}

