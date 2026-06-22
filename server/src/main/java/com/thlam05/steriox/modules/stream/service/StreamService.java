package com.thlam05.steriox.modules.stream.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.common.service.RedisService;
import com.thlam05.steriox.common.service.S3Service;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.request.LikeStreamRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamLikeResponse;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamLikeStatusResponse;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.entity.StreamKey;
import com.thlam05.steriox.modules.stream.enums.StreamStatus;
import com.thlam05.steriox.modules.stream.mapper.StreamMapper;
import com.thlam05.steriox.modules.stream.repository.CategoryRepository;
import com.thlam05.steriox.modules.stream.repository.StreamKeyRepository;
import com.thlam05.steriox.modules.stream.repository.StreamRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamService {
    private final StreamRepository streamRepository;
    private final StreamKeyRepository streamKeyRepository;
    private final CategoryRepository categoryRepository;
    private final StreamSchedulerService streamSchedulerService;
    private final StreamMapper streamMapper;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final RedisService redisService;

    // private String redisLivestreamLikesKey = "livestreams:likes:";

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

    // public List<StreamResponse> getAllStreamOnline() {
    // List<Stream> streams = streamRepository.findAllStreamOnline();
    // return streamMapper.toStreamResponses(streams);
    // }

    // public StreamResponse update(String id, UpdateStreamRequest request) {
    // Stream stream = streamRepository.findById(id)
    // .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not
    // found"));

    // if (request.getUserId() != null &&
    // !request.getUserId().equals(stream.getUser().getId())) {
    // User user = userRepository.findById(request.getUserId())
    // .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "User not
    // found"));
    // stream.setUser(user);
    // }

    // mergeStreamFields(stream, request);
    // return streamMapper.toStreamResponse(streamRepository.save(stream));
    // }

    // public void delete(String id) {
    // if (!streamRepository.existsById(id)) {
    // throw new AppException(ResponseStatus.NOT_FOUND, "Stream not found");
    // }
    // streamRepository.deleteById(id);
    // }

    // public StreamResponse startStream(String id) {
    // Stream stream = streamRepository.findById(id)
    // .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not
    // found"));

    // stream.setIsActive(true);
    // stream.setOnStream(true);
    // stream.setStartedAt(LocalDateTime.now());
    // stream = streamRepository.save(stream);
    // streamSchedulerService.startHeartbeatTask(id);
    // return streamMapper.toStreamResponse(stream);
    // }

    // public StreamResponse stopStream(String id) {
    // Stream stream = streamRepository.findById(id)
    // .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not
    // found"));

    // stream.setIsActive(false);
    // stream.setOnStream(false);
    // stream.setEndedAt(LocalDateTime.now());
    // stream = streamRepository.save(stream);
    // return streamMapper.toStreamResponse(stream);
    // }

    // public LivestreamLikeResponse likeStream(String id, LikeStreamRequest
    // request) {
    // if (!streamRepository.existsById(id)) {
    // throw new AppException(ResponseStatus.NOT_FOUND, "Stream not found");
    // }

    // String livestreamLikesKey = getLivestreamLikesKey(id);

    // if (!redisService.isMemberOfSet(livestreamLikesKey, request.getUserId())) {
    // redisService.addToSet(livestreamLikesKey, request.getUserId());
    // }

    // long currentLikes = redisService.countMember(livestreamLikesKey);
    // return LivestreamLikeResponse.builder().likes(currentLikes).build();
    // }

    // public LivestreamLikeStatusResponse checkIsLikedStream(String livestreamId) {
    // Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // Boolean isLiked = null;

    // if (authentication != null && authentication.isAuthenticated()
    // && !authentication.getPrincipal().equals("anonymousUser")) {

    // String userId = authentication.getName();
    // String livestreamLikesKey = getLivestreamLikesKey(livestreamId);

    // if (redisService.isKeyExist(livestreamLikesKey)) {
    // isLiked = redisService.isMemberOfSet(livestreamLikesKey, userId);
    // } else {
    // boolean existsInDb = streamRepository.existsByStreamIdAndUserId(livestreamId,
    // userId);

    // if (existsInDb) {
    // isLiked = true;
    // redisService.addToSet(livestreamLikesKey, userId);
    // } else {
    // isLiked = false;
    // }
    // }
    // }

    // return LivestreamLikeStatusResponse.builder().isLiked(isLiked).build();
    // }

    // private void mergeStreamFields(Stream stream, UpdateStreamRequest request) {
    // if (request.getTitle() != null) {
    // stream.setTitle(request.getTitle());
    // }
    // if (request.getDescription() != null) {
    // stream.setDescription(request.getDescription());
    // }
    // if (request.getStatus() != null) {
    // stream.setStatus(request.getStatus());
    // }
    // if (request.getIsActive() != null) {
    // stream.setIsActive(request.getIsActive());
    // }
    // if (request.getThumbnail() != null) {
    // stream.setThumbnail(request.getThumbnail());
    // }
    // if (request.getTotalViews() != null) {
    // stream.setTotalViews(request.getTotalViews());
    // }
    // if (request.getTotalLikes() != null) {
    // stream.setTotalLikes(request.getTotalLikes());
    // }
    // if (request.getStartedAt() != null) {
    // stream.setStartedAt(request.getStartedAt());
    // }
    // if (request.getEndedAt() != null) {
    // stream.setEndedAt(request.getEndedAt());
    // }
    // }

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

    // private String getLivestreamLikesKey(String id) {
    // return redisLivestreamLikesKey + id;
    // }
}
