package com.thlam05.steriox.common.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.thlam05.steriox.common.message.StreamChatMessage;

@Component
public class ChatConsumer {
    private final SimpMessagingTemplate messagingTemplate;

    public ChatConsumer(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @RabbitListener(queues = "q.chat.persist")
    public void handleChatPersist(StreamChatMessage message) {
        messagingTemplate.convertAndSend("/topic/chat/" + message.getStreamId(), message);
    }

    @RabbitListener(queues = "q.chat.toxic-check")
    public void handleToxicCheck(StreamChatMessage message) {
        // placeholder
    }
}
