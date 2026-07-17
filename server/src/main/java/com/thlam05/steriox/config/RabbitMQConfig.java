package com.thlam05.steriox.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class RabbitMQConfig {

    static final String DIRECT_EXCHANGE = "steriox.direct";
    static final String TOPIC_EXCHANGE = "steriox.topic";
    static final String DEAD_EXCHANGE = "steriox.dead";

    static final String QUEUE_CHAT_TOXIC = "q.chat.toxic-check";
    static final String QUEUE_CHAT_PERSIST = "q.chat.persist";
    static final String QUEUE_STREAM_LIFECYCLE = "q.stream.lifecycle";
    static final String QUEUE_STREAM_LIKE = "q.stream.like";
    static final String QUEUE_THUMBNAIL = "q.thumbnail.process";
    static final String QUEUE_DLQ_CHAT = "dlq.chat";
    static final String QUEUE_DLQ_GENERAL = "dlq.general";

    @Bean
    DirectExchange directExchange() {
        return new DirectExchange(DIRECT_EXCHANGE);
    }

    @Bean
    TopicExchange topicExchange() {
        return new TopicExchange(TOPIC_EXCHANGE);
    }

    @Bean
    DirectExchange deadLetterExchange() {
        return new DirectExchange(DEAD_EXCHANGE);
    }

    @Bean
    Queue chatToxicCheckQueue() {
        return new Queue(QUEUE_CHAT_TOXIC, true);
    }

    @Bean
    Queue chatPersistQueue() {
        return new Queue(QUEUE_CHAT_PERSIST, true);
    }

    @Bean
    Queue streamLifecycleQueue() {
        return new Queue(QUEUE_STREAM_LIFECYCLE, true);
    }

    @Bean
    Queue streamLikeQueue() {
        return new Queue(QUEUE_STREAM_LIKE, true);
    }

    @Bean
    Queue thumbnailProcessQueue() {
        return new Queue(QUEUE_THUMBNAIL, true);
    }

    @Bean
    Queue chatDeadLetterQueue() {
        return new Queue(QUEUE_DLQ_CHAT, true);
    }

    @Bean
    Queue generalDeadLetterQueue() {
        return new Queue(QUEUE_DLQ_GENERAL, true);
    }

    @Bean
    Binding chatToxicBinding() {
        return BindingBuilder.bind(chatToxicCheckQueue())
                .to(topicExchange())
                .with("chat.#");
    }

    @Bean
    Binding chatPersistBinding() {
        return BindingBuilder.bind(chatPersistQueue())
                .to(topicExchange())
                .with("chat.#");
    }

    @Bean
    Binding streamLifecycleBinding() {
        return BindingBuilder.bind(streamLifecycleQueue())
                .to(directExchange())
                .with("stream.lifecycle.*");
    }

    @Bean
    Binding streamLikeBinding() {
        return BindingBuilder.bind(streamLikeQueue())
                .to(directExchange())
                .with("stream.like.*");
    }

    @Bean
    Binding thumbnailProcessBinding() {
        return BindingBuilder.bind(thumbnailProcessQueue())
                .to(directExchange())
                .with("thumbnail.process");
    }

    @Bean
    Binding chatDeadLetterBinding() {
        return BindingBuilder.bind(chatDeadLetterQueue())
                .to(deadLetterExchange())
                .with("chat.dlq");
    }

    @Bean
    Binding generalDeadLetterBinding() {
        return BindingBuilder.bind(generalDeadLetterQueue())
                .to(deadLetterExchange())
                .with("general.dlq");
    }

    @Bean
    MessageConverter jsonMessageConverter() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return new Jackson2JsonMessageConverter(objectMapper);
    }

    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }
}
