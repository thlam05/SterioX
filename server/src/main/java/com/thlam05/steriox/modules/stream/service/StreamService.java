package com.thlam05.steriox.modules.stream.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.common.message.LikeEvent;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamStatusResponse;
import com.thlam05.steriox.common.service.RedisService;
import com.thlam05.steriox.common.service.S3Service;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamLikeStatusResponse;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.entity.StreamKey;
import com.thlam05.steriox.modules.stream.mapper.StreamMapper;
import com.thlam05.steriox.modules.stream.repository.CategoryRepository;
import com.thlam05.steriox.modules.stream.repository.StreamKeyRepository;
import com.thlam05.steriox.modules.stream.repository.StreamLikeRepository;
import com.thlam05.steriox.modules.stream.repository.StreamRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamService {
    private final StreamRepository streamRepository;
    private final StreamLikeRepository streamLikeRepository;
    private final StreamKeyRepository streamKeyRepository;
    private final CategoryRepository categoryRepository;
    private final StreamMapper streamMapper;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final RedisService redisService;
    private final SimpMessagingTemplate messagingTemplate;
    private final RabbitTemplate rabbitTemplate;

    private String redisLivestreamLikesKey = "livestreams:likes:";

    public StreamResponse create(CreateStreamRequest request) throws IOException {
        validateCreateRequest(request);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "User not found"));

        StreamKey streamKey = streamKeyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream key not found"));

        Stream stream = streamMapper.toStream(request);

        stream.setPlayUrl(generatePlayUrl(streamKey));
        stream.setIsActive(true);
        stream.setTotalViews(0);
        stream.setTotalLikes(0);
        stream.setUser(user);
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            if (request.getCategoryIds().stream().anyMatch(id -> id == null || id.isBlank())) {
                throw new AppException(ResponseStatus.BAD_REQUEST, "Category IDs must not be blank");
            }

            Set<String> uniqueRequestIds = new HashSet<>(request.getCategoryIds());
            List<Category> categories = categoryRepository.findAllById(uniqueRequestIds);

            if (categories.size() != uniqueRequestIds.size()) {
                throw new AppException(ResponseStatus.BAD_REQUEST, "Some categories not found");
            }

            stream.setCategories(new HashSet<>(categories));
        }

        if (request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
            String thumbnailUrl = s3Service.uploadFile(request.getThumbnail());
            stream.setThumbnail(thumbnailUrl);
        }

        return streamMapper.toStreamResponse(streamRepository.save(stream));
    }

    public StreamResponse getById(String id) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not found"));
        return streamMapper.toStreamResponse(stream);
    }

    public StreamResponse getStreamOnlineByUserId(String userId) {
        Stream stream = streamRepository.findStreamOnlineByUserId(userId)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not found"));
        return streamMapper.toStreamResponse(stream);
    }

    public List<StreamResponse> getAll() {
        return streamMapper.toStreamResponses(streamRepository.findAll());
    }

    public List<StreamResponse> getTopStream() {
        List<Stream> streams = streamRepository.findTop10ByOnStreamTrueOrderByTotalLikesDesc();
        return streamMapper.toStreamResponses(streams);
    }

    public StreamResponse startStream(String id) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not found"));

        stream.setIsActive(true);
        stream.setOnStream(true);
        stream.setStartedAt(LocalDateTime.now());
        stream = streamRepository.save(stream);
        return streamMapper.toStreamResponse(stream);
    }

    public StreamResponse stopStream(String id) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not found"));

        stream.setIsActive(false);
        stream.setOnStream(false);
        stream.setEndedAt(LocalDateTime.now());
        stream = streamRepository.save(stream);

        redisService.deleteKey("livestreams:views:" + id);
        redisService.deleteKey("livestreams:unique-views:" + id);

        return streamMapper.toStreamResponse(stream);
    }

    public void likeStream(String streamId) {
        String userId = getAuthenticatedUserId();

        rabbitTemplate.convertAndSend("steriox.direct", "stream.like." + streamId,
                LikeEvent.builder()
                        .streamId(streamId)
                        .userId(userId)
                        .action("LIKE")
                        .build());
    }

    public void unlikeStream(String streamId) {
        String userId = getAuthenticatedUserId();

        rabbitTemplate.convertAndSend("steriox.direct", "stream.like." + streamId,
                LikeEvent.builder()
                        .streamId(streamId)
                        .userId(userId)
                        .action("UNLIKE")
                        .build());
    }

    private String getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AppException(ResponseStatus.UNAUTHORIZED, "User must be logged in");
        }
        return authentication.getName();
    }

    private Stream findStreamById(String streamId) {
        return streamRepository.findById(streamId)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not found"));
    }

    public LivestreamLikeStatusResponse checkIsLikedStream(String livestreamId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {
            return LivestreamLikeStatusResponse.builder().isLiked(false).build();
        }

        String userId = authentication.getName();
        String livestreamLikesKey = getLivestreamLikesKey(livestreamId);
        boolean isLiked = false;

        if (redisService.existsKey(livestreamLikesKey)) {
            isLiked = redisService.setIsMember(livestreamLikesKey, userId);
        } else {
            isLiked = streamLikeRepository.existsByStreamIdAndUserId(livestreamId, userId);
            if (isLiked) {
                redisService.setAdd(livestreamLikesKey, userId);
            }
        }

        return LivestreamLikeStatusResponse.builder().isLiked(isLiked).build();
    }

    private void validateCreateRequest(CreateStreamRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "User ID is required");
        }
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Title is required");
        }
    }

    private String generatePlayUrl(StreamKey streamKey) {
        String playUrl = "http://localhost:5555/hls/" + streamKey.getStreamKey() +
                ".m3u8";
        return playUrl;
    }

    private String getLivestreamLikesKey(String id) {
        return redisLivestreamLikesKey + id;
    }

    @Transactional
    public void handleViewHeartbeat(String streamId, String userId) {
        String viewsKey = "livestreams:views:" + streamId;
        double currentTimestamp = System.currentTimeMillis() / 1000.0;

        redisService.zSetAdd(viewsKey, userId, currentTimestamp);

        String uniqueViewsKey = "livestreams:unique-views:" + streamId;
        if (!redisService.setIsMember(uniqueViewsKey, userId)) {
            redisService.setAdd(uniqueViewsKey, userId);

            Stream stream = findStreamById(streamId);
            stream.setTotalViews((stream.getTotalViews() != null ? stream.getTotalViews() : 0) + 1);
            streamRepository.save(stream);
        }
    }

    @Scheduled(fixedRate = 3000)
    public void broadcastActiveViewsAndLikes() {
        List<Stream> onlineStreams = streamRepository.findAllStreamOnline();
        if (onlineStreams == null || onlineStreams.isEmpty()) {
            return;
        }

        double currentTimestamp = System.currentTimeMillis() / 1000.0;

        for (Stream stream : onlineStreams) {
            String streamId = stream.getId();
            String viewsKey = "livestreams:views:" + streamId;

            // Clean up viewers inactive for more than 15 seconds
            redisService.zSetRemoveRangeByScore(viewsKey, 0, currentTimestamp - 15);

            // Count active viewers
            long activeViews = redisService.zSetSize(viewsKey);

            // Get total likes
            String likesKey = getLivestreamLikesKey(streamId);
            long totalLikes = redisService.setSize(likesKey);

            // Broadcast to STOMP topic
            String destination = "/topic/status-livestream/" + streamId;
            messagingTemplate.convertAndSend(destination, LivestreamStatusResponse.builder()
                    .views(activeViews)
                    .likes(totalLikes)
                    .build());
        }
    }
}
