package com.thlam05.steriox.common.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.thlam05.steriox.common.message.StreamLifecycleEvent;

@Component
public class StreamLifecycleConsumer {

    @RabbitListener(queues = "q.stream.lifecycle")
    public void handleStreamLifecycle(StreamLifecycleEvent event) {
    }
}
