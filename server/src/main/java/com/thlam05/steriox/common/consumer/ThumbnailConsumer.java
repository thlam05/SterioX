package com.thlam05.steriox.common.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.thlam05.steriox.common.message.ThumbnailProcessEvent;

@Component
public class ThumbnailConsumer {

    @RabbitListener(queues = "q.thumbnail.process")
    public void handleThumbnailProcessing(ThumbnailProcessEvent event) {
    }
}
