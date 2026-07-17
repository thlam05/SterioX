package com.thlam05.steriox.common.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class DeadLetterConsumer {
    private static final Logger log = LoggerFactory.getLogger(DeadLetterConsumer.class);

    @RabbitListener(queues = "dlq.chat")
    public void handleFailedChat(Object message) {
        log.warn("Dead letter - chat: {}", message);
    }

    @RabbitListener(queues = "dlq.general")
    public void handleFailedGeneral(Object message) {
        log.warn("Dead letter - general: {}", message);
    }
}
