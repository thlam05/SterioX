package com.thlam05.steriox.modules.stream.service;

import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.common.service.RedisService;
import com.thlam05.steriox.modules.stream.dto.request.HeartbeatMessage;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamViewResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamSocketService {
    private static final String VIEWERS_KEY_PREFIX = "livestream:viewers:";
    private static final String VIEWER_HEARTBEAT_KEY_PREFIX = "livestream:heartbeat:";

    private final RedisService redisService;
    private final SimpMessagingTemplate messagingTemplate;

    public void refreshHearbeat(String livestreamId, HeartbeatMessage message) {
        validateHeartbeat(livestreamId, message);

        String viewersKey = getViewersKey(livestreamId);
        String heartbeatKey = getHeartbeatKey(livestreamId);

        if (!redisService.isMemberOfSet(viewersKey, message.getUserId())) {
            redisService.addToSet(viewersKey, message.getUserId());
        }

        long currentTimestamp = System.currentTimeMillis() / 1000;
        redisService.addToZSet(heartbeatKey, message.getUserId(), currentTimestamp);

        long currentViews = redisService.countZSetSize(heartbeatKey);

        String destination = "/topic/view-livestream/" + livestreamId;
        messagingTemplate.convertAndSend(destination, LivestreamViewResponse.builder().views(currentViews).build());
    }

    public void cleanExpiredViews(String livestreamId) {
        String heartbeatKey = getHeartbeatKey(livestreamId);

        long currentTimestamp = System.currentTimeMillis() / 1000;
        long expirationTime = currentTimestamp - 30;

        redisService.removeRangeByScore(heartbeatKey, 0, expirationTime);

        long currentViews = redisService.countZSetSize(heartbeatKey);

        String destination = "/topic/view-livestream/" + livestreamId;
        messagingTemplate.convertAndSend(destination, LivestreamViewResponse.builder().views(currentViews).build());
    }

    private void validateHeartbeat(String livestreamId, HeartbeatMessage message) {
        if (livestreamId == null || livestreamId.isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Livestream ID is required");
        }
        if (message == null || message.getUserId() == null || message.getUserId().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "User ID is required");
        }
    }

    private String getViewersKey(String livestreamId) {
        return VIEWERS_KEY_PREFIX + livestreamId;
    }

    private String getHeartbeatKey(String livestreamId) {
        return VIEWER_HEARTBEAT_KEY_PREFIX + livestreamId;
    }
}
