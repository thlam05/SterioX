package com.thlam05.steriox.modules.stream.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.common.service.S3Service;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.entity.StreamKey;
import com.thlam05.steriox.modules.stream.enums.StreamStatus;
import com.thlam05.steriox.modules.stream.mapper.StreamMapper;
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
    private final StreamMapper streamMapper;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    public StreamResponse create(CreateStreamRequest request) throws IOException {
        validateCreateRequest(request);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "User not found"));

        StreamKey streamKey = streamKeyRepository.findByUserId(user.getId())
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream key not found"));

        Stream stream = streamMapper.toStream(request);
        stream.setPlayUrl(generatePlayUrl(streamKey));
        stream.setIsActive(true);
        stream.setCurrentViewers(0);
        stream.setMaxViewers(0);
        stream.setTotalLikes(0);
        stream.setUser(user);
        stream.setStartedAt(LocalDateTime.now());
        if (stream.getStatus() == null) {
            stream.setStatus(StreamStatus.PUBLIC.name());
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

    public StreamResponse update(String id, UpdateStreamRequest request) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream not found"));

        if (request.getUserId() != null && !request.getUserId().equals(stream.getUser().getId())) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "User not found"));
            stream.setUser(user);
        }

        mergeStreamFields(stream, request);
        return streamMapper.toStreamResponse(streamRepository.save(stream));
    }

    public void delete(String id) {
        if (!streamRepository.existsById(id)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Stream not found");
        }
        streamRepository.deleteById(id);
    }

    private void mergeStreamFields(Stream stream, UpdateStreamRequest request) {
        if (request.getTitle() != null) {
            stream.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            stream.setDescription(request.getDescription());
        }
        if (request.getStatus() != null) {
            stream.setStatus(request.getStatus());
        }
        if (request.getIsActive() != null) {
            stream.setIsActive(request.getIsActive());
        }
        if (request.getThumbnail() != null) {
            stream.setThumbnail(request.getThumbnail());
        }
        if (request.getCurrentViewers() != null) {
            stream.setCurrentViewers(request.getCurrentViewers());
        }
        if (request.getMaxViewers() != null) {
            stream.setMaxViewers(request.getMaxViewers());
        }
        if (request.getTotalLikes() != null) {
            stream.setTotalLikes(request.getTotalLikes());
        }
        if (request.getStartedAt() != null) {
            stream.setStartedAt(request.getStartedAt());
        }
        if (request.getEndedAt() != null) {
            stream.setEndedAt(request.getEndedAt());
        }
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
        String playUrl = "http://localhost:5555/hls/" + streamKey.getStreamKey() + ".m3u8";
        return playUrl;
    }
}
