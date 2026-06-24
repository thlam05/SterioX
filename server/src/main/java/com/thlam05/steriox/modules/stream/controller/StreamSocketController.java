package com.thlam05.steriox.modules.stream.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.thlam05.steriox.modules.stream.dto.request.HeartbeatMessage;
import com.thlam05.steriox.modules.stream.service.StreamSocketService;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class StreamSocketController {
    private final StreamSocketService streamSocketService;

    @MessageMapping("/view-livestream/{livestreamId}")
    public void heartbeat(@DestinationVariable String livestreamId, HeartbeatMessage message) {
        streamSocketService.refreshHearbeat(livestreamId, message);
    }

}
