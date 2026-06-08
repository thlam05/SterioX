package com.thlam05.steriox.modules.stream.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class StreamSocketController {

    class ChassMessage {
        String sender;
        String content;
    }

    @MessageMapping("/test")
    @SendTo("/topic/test")
    public ChassMessage test(ChassMessage s) {
        return s;
    }
}
