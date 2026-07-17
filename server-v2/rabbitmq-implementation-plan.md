# RabbitMQ Implementation Plan

## 1. Overview

RabbitMQ dependency (`spring-boot-starter-amqp`) is already declared in `pom.xml`, but `RabbitMQConfig.java` is an empty stub. This plan wires RabbitMQ into the backend to handle async workloads, decouple real-time components, and improve scalability.

---

## 2. Configuration

### 2.1 application.yml

Externalize RabbitMQ connection properties via environment variables:

```yaml
spring:
  rabbitmq:
    host: ${RABBITMQ_HOST:localhost}
    port: ${RABBITMQ_PORT:5672}
    username: ${RABBITMQ_USERNAME:guest}
    password: ${RABBITMQ_PASSWORD:guest}
    listener:
      simple:
        retry:
          enabled: true
          initial-interval: 3000
          max-attempts: 3
          multiplier: 1.5
```

### 2.2 .env

Add entries for production RabbitMQ connection.

---

## 3. Message Schemas (DTOs)

Create `server/src/main/java/com/thlam05/steriox/common/message/` package with:

| Class | Purpose |
|---|---|
| `StreamChatMessage` | streamId, userId, username, content, timestamp |
| `StreamLifecycleEvent` | streamId, userId, eventType (STARTED/STOPPED), timestamp |
| `LikeEvent` | streamId, userId, action (LIKE/UNLIKE) |
| `ThumbnailProcessEvent` | streamId, thumbnailUrl |
| `ToxicCheckMessage` | chatId, streamId, userId, content |

---

## 4. Exchange & Queue Topology

Define in `RabbitMQConfig.java`:

### Exchanges

| Exchange Name | Type | Purpose |
|---|---|---|
| `steriox.direct` | Direct | Stream lifecycle, like events |
| `steriox.topic` | Topic | Chat messages (routing by streamId) |
| `steriox.dead` | Direct | Dead-letter for failed messages |

### Queues & Bindings

| Queue | Routing Key | Exchange | TTL | DLX | Purpose |
|---|---|---|---|---|---|
| `q.chat.toxic-check` | `chat.#` | `steriox.topic` | -- | `steriox.dead` | Async toxicity check |
| `q.chat.persist` | `chat.#` | `steriox.topic` | -- | `steriox.dead` | Persist chat to DB |
| `q.stream.lifecycle` | `stream.lifecycle.*` | `steriox.direct` | -- | `steriox.dead` | Start/stop notifications |
| `q.stream.like` | `stream.like.*` | `steriox.direct` | -- | `steriox.dead` | Like/unlike processing |
| `q.thumbnail.process` | `thumbnail.process` | `steriox.direct` | -- | `steriox.dead` | Thumbnail processing |
| `dlq.chat` | `chat.dlq` | `steriox.dead` | 10000 | -- | Dead-letter queue for chats |
| `dlq.general` | `general.dlq` | `steriox.dead` | 10000 | -- | General dead-letter queue |

### Config Class Structure

```java
@Configuration
public class RabbitMQConfig {

    // Exchanges
    @Bean public DirectExchange directExchange() { ... }
    @Bean public TopicExchange topicExchange() { ... }
    @Bean public DirectExchange deadLetterExchange() { ... }

    // Queues with DLQ bindings
    @Bean public Queue chatToxicCheckQueue() { ... }
    @Bean public Queue chatPersistQueue() { ... }
    @Bean public Queue streamLifecycleQueue() { ... }
    @Bean public Queue streamLikeQueue() { ... }
    @Bean public Queue thumbnailProcessQueue() { ... }
    @Bean public Queue chatDeadLetterQueue() { ... }
    @Bean public Queue generalDeadLetterQueue() { ... }

    // Binding beans
    @Bean public Binding chatToxicBinding() { ... }
    // ... etc
}
```

---

## 5. Producers (Services that publish messages)

### 5.1 StreamChatService (Producer)

After saving a chat, publish to `steriox.topic` with routing key `chat.{streamId}`:

```java
rabbitTemplate.convertAndSend(
    "steriox.topic",
    "chat." + request.getStreamId(),
    chatMessage
);
```

Remove the direct `messagingTemplate.convertAndSend` call from chat creation — let a consumer handle STOMP broadcast asynchronously.

### 5.2 StreamService (Producer)

- **Like/Unlike**: Publish `LikeEvent` to `steriox.direct` with routing key `stream.like.{streamId}`
- **Start/Stop**: Publish `StreamLifecycleEvent` to `steriox.direct` with routing key `stream.lifecycle.{streamId}`
- **Thumbnail upload**: Publish `ThumbnailProcessEvent` to `steriox.direct` with routing key `thumbnail.process`

---

## 6. Consumers (Listeners)

Create `server/src/main/java/com/thlam05/steriox/common/consumer/` package:

### 6.1 ChatConsumer

```java
@Component
public class ChatConsumer {

    @RabbitListener(queues = "q.chat.toxic-check")
    public void handleToxicCheck(StreamChatMessage message) { ... }

    @RabbitListener(queues = "q.chat.persist")
    public void handleChatPersist(StreamChatMessage message) {
        // 1. Save StreamChat to DB
        // 2. Broadcast via SimpMessagingTemplate to /topic/chat/{streamId}
    }
}
```

This decouples HTTP request from DB write + STOMP broadcast. The `createChat` endpoint becomes fire-and-forget.

### 6.2 StreamLifecycleConsumer

```java
@Component
public class StreamLifecycleConsumer {

    @RabbitListener(queues = "q.stream.lifecycle")
    public void handleStreamLifecycle(StreamLifecycleEvent event) {
        // Send push/email notifications to followers
        // Update stream status in DB
        // Log analytics event
    }
}
```

### 6.3 LikeConsumer

```java
@Component
public class LikeConsumer {

    @RabbitListener(queues = "q.stream.like")
    public void handleLikeEvent(LikeEvent event) {
        // Update Redis like set
        // Sync like count to DB
        // Broadcast via STOMP
    }
}
```

### 6.4 ThumbnailConsumer

```java
@Component
public class ThumbnailConsumer {

    @RabbitListener(queues = "q.thumbnail.process")
    public void handleThumbnailProcessing(ThumbnailProcessEvent event) {
        // Resize/optimize thumbnail
        // Upload processed version to S3
        // Update stream record with final URL
    }
}
```

---

## 7. Retry & Error Handling

### 7.1 Listener Retry

Configure retry in `application.yml` (see section 2.1). After 3 failed attempts, message routes to DLX → `dlq.chat` or `dlq.general`.

### 7.2 Dead Letter Queue Consumer

```java
@Component
public class DeadLetterConsumer {

    @RabbitListener(queues = "dlq.chat")
    public void handleFailedChat(StreamChatMessage message) {
        // Log to error table or alert
    }

    @RabbitListener(queues = "dlq.general")
    public void handleFailedGeneral(Object message) {
        // Log to error table or alert
    }
}
```

### 7.3 Republish from DLQ (optional)

If recovery is possible, republish back to original queue after delay:

```java
@Scheduled(fixedRate = 60000)
public void retryDeadLetteredMessages() {
    // Read from DLQ, republish to original exchange
}
```

---

## 8. JSON Message Serialization

Create `MessagePack` helper or configure `Jackson2JsonMessageConverter` as the default RabbitTemplate message converter to avoid manual serialization.

```java
@Bean
public MessageConverter jsonMessageConverter() {
    return new Jackson2JsonMessageConverter(objectMapper);
}

@Bean
public AmqpTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                    MessageConverter messageConverter) {
    RabbitTemplate template = new RabbitTemplate(connectionFactory);
    template.setMessageConverter(messageConverter);
    return template;
}
```

---

## 9. Migration Steps (Ordered)

| Step | File(s) | Description |
|---|---|---|
| **1** | `application.yml` | Add RabbitMQ config with env-based properties and retry settings |
| **2** | `RabbitMQConfig.java` | Define exchanges, queues (with DLQ), and bindings |
| **3** | `RabbitMQConfig.java` | Add `Jackson2JsonMessageConverter` bean and configured `RabbitTemplate` bean |
| **4** | New: `common/message/*.java` | Create message DTOs for each event type |
| **5** | New: `common/consumer/ChatConsumer.java` | Implement chat persist + toxic check consumers |
| **6** | `StreamChatService.java` | Publish to RabbitMQ instead of directly persisting + broadcasting |
| **7** | New: `common/consumer/LikeConsumer.java` | Implement like/unlike async consumer |
| **8** | `StreamService.java` | Publish `LikeEvent` to RabbitMQ instead of synchronous processing |
| **9** | New: `common/consumer/StreamLifecycleConsumer.java` | Implement lifecycle consumer |
| **10** | `StreamService.java` | Publish lifecycle events on start/stop |
| **11** | New: `common/consumer/ThumbnailConsumer.java` | Implement thumbnail processing consumer |
| **12** | `StreamService.java` | Publish thumbnail events instead of blocking S3 upload |
| **13** | New: `common/consumer/DeadLetterConsumer.java` | Implement DLQ monitoring with logging/alerting |
| **14** | `.env` | Add RabbitMQ env variables |
| **15** | Test | Start RabbitMQ locally (Docker), run full integration tests |

---

## 10. Testing Strategy

| Type | What |
|---|---|
| **Unit** | Mock `RabbitTemplate` in service tests; verify `convertAndSend` called with correct routing key |
| **Integration** | `@SpringBootTest` with `TestRabbitTemplate` or embedded RabbitMQ (`RabbitMQTestContainer`) |
| **Consumer** | Publish known messages to queues, verify STOMP broadcast and DB side effects |
| **DLQ** | Publish poison messages, verify they land in DLQ and get handled |

---

## 11. Architectural Benefits

1. **Decoupling**: HTTP request handlers no longer block on DB writes, S3 uploads, or STOMP broadcasts
2. **Resilience**: Failed message processing retries up to 3 times, then dead-letters for manual recovery
3. **Scalability**: Consumers can be scaled independently (multiple `@RabbitListener` instances on the same queue)
4. **Ordering**: Per-stream chat ordering guaranteed via topic exchange routing
5. **Observability**: RabbitMQ Management UI provides visibility into queue depths, processing rates, and failures
