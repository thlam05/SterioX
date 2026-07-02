package com.thlam05.steriox.modules.stream.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.common.service.RedisService;
import com.thlam05.steriox.common.service.S3Service;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamLikeStatusResponse;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.entity.StreamKey;
import com.thlam05.steriox.modules.stream.entity.StreamLike;
import com.thlam05.steriox.modules.stream.types.StreamLikeId;
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
        return streamMapper.toStreamResponse(stream);
    }

    @Transactional
    public void likeStream(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AppException(ResponseStatus.UNAUTHORIZED, "User must be logged in");
        }
        String userId = authentication.getName();

        if (!streamRepository.existsById(id)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Stream not found");
        }

        // key redis
        String LivestreamLikesKey = getLivestreamLikesKey(id);
        if (redisService.setIsMember(LivestreamLikesKey, userId) == false) {
            redisService.setAdd(LivestreamLikesKey, userId);

            // Persist to database
            Stream stream = streamRepository.getReferenceById(id);
            User user = userRepository.getReferenceById(userId);

            StreamLikeId likeId = StreamLikeId.builder()
                    .streamId(id)
                    .userId(userId)
                    .build();

            StreamLike streamLike = StreamLike.builder()
                    .id(likeId)
                    .stream(stream)
                    .user(user)
                    .build();

            streamLikeRepository.save(streamLike);

            long likes = redisService.setSize(LivestreamLikesKey);
            stream.setTotalLikes((int) likes);
            streamRepository.save(stream);
        }
    }

    @Transactional
    public void unlikeStream(String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AppException(ResponseStatus.UNAUTHORIZED, "User must be logged in");
        }
        String userId = authentication.getName();

        if (!streamRepository.existsById(id)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Stream not found");
        }

        // key redis
        String LivestreamLikesKey = getLivestreamLikesKey(id);
        if (redisService.setIsMember(LivestreamLikesKey, userId) == true) {
            redisService.setRemove(LivestreamLikesKey, userId);

            // Remove from database
            streamLikeRepository.deleteByStreamIdAndUserId(id, userId);

            Stream stream = streamRepository.getReferenceById(id);
            long likes = redisService.setSize(LivestreamLikesKey);
            stream.setTotalLikes((int) likes);
            streamRepository.save(stream);
        }
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
}
