package com.thlam05.steriox.common.consumer;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.thlam05.steriox.common.message.LikeEvent;
import com.thlam05.steriox.common.service.RedisService;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamLikeResponse;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.entity.StreamLike;
import com.thlam05.steriox.modules.stream.repository.StreamLikeRepository;
import com.thlam05.steriox.modules.stream.repository.StreamRepository;
import com.thlam05.steriox.modules.stream.types.StreamLikeId;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

@Component
public class LikeConsumer {
    private final StreamRepository streamRepository;
    private final StreamLikeRepository streamLikeRepository;
    private final UserRepository userRepository;
    private final RedisService redisService;
    private final SimpMessagingTemplate messagingTemplate;

    public LikeConsumer(StreamRepository streamRepository,
            StreamLikeRepository streamLikeRepository,
            UserRepository userRepository,
            RedisService redisService,
            SimpMessagingTemplate messagingTemplate) {
        this.streamRepository = streamRepository;
        this.streamLikeRepository = streamLikeRepository;
        this.userRepository = userRepository;
        this.redisService = redisService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    @RabbitListener(queues = "q.stream.like")
    public void handleLikeEvent(LikeEvent event) {
        String likesKey = "livestreams:likes:" + event.getStreamId();
        Stream stream = streamRepository.findById(event.getStreamId()).orElse(null);
        if (stream == null) {
            return;
        }

        if ("LIKE".equals(event.getAction())) {
            if (!redisService.setIsMember(likesKey, event.getUserId())) {
                redisService.setAdd(likesKey, event.getUserId());

                User user = userRepository.getReferenceById(event.getUserId());
                StreamLikeId likeId = StreamLikeId.builder()
                        .streamId(event.getStreamId())
                        .userId(event.getUserId())
                        .build();
                StreamLike streamLike = StreamLike.builder()
                        .id(likeId)
                        .stream(stream)
                        .user(user)
                        .build();
                streamLikeRepository.save(streamLike);
            }
        } else if ("UNLIKE".equals(event.getAction())) {
            if (redisService.setIsMember(likesKey, event.getUserId())) {
                redisService.setRemove(likesKey, event.getUserId());
                streamLikeRepository.deleteByStreamIdAndUserId(event.getStreamId(), event.getUserId());
            }
        }

        long totalLikes = redisService.setSize(likesKey);
        stream.setTotalLikes((int) totalLikes);
        streamRepository.save(stream);

        messagingTemplate.convertAndSend("/topic/likes-livestreams/" + event.getStreamId(),
                LivestreamLikeResponse.builder().likes(totalLikes).build());
    }
}
