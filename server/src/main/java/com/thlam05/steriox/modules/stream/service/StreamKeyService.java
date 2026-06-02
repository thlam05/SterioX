package com.thlam05.steriox.modules.stream.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamKeyRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateStreamKeyRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamKeyResponse;
import com.thlam05.steriox.modules.stream.entity.StreamKey;
import com.thlam05.steriox.modules.stream.mapper.StreamKeyMapper;
import com.thlam05.steriox.modules.stream.repository.StreamKeyRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamKeyService {
    private final StreamKeyRepository streamKeyRepository;
    private final StreamKeyMapper streamKeyMapper;
    private final UserRepository userRepository;

    public StreamKeyResponse create(CreateStreamKeyRequest request) {
        validateCreateRequest(request);

        if (streamKeyRepository.existsById(request.getStreamKey())) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Stream key already exists");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "User not found"));

        StreamKey streamKey = streamKeyMapper.toStreamKey(request);
        streamKey.setUser(user);
        if (streamKey.getIsActive() == null) {
            streamKey.setIsActive(true);
        }

        return streamKeyMapper.toStreamKeyResponse(streamKeyRepository.save(streamKey));
    }

    public List<StreamKeyResponse> getAll() {
        return streamKeyMapper.toStreamKeyResponses(streamKeyRepository.findAll());
    }

    public StreamKeyResponse getByKey(String key) {
        StreamKey streamKey = streamKeyRepository.findById(key)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream key not found"));
        return streamKeyMapper.toStreamKeyResponse(streamKey);
    }

    public List<StreamKeyResponse> getByUserId(String userId) {
        return streamKeyMapper.toStreamKeyResponses(streamKeyRepository.findByUserId(userId));
    }

    public StreamKeyResponse update(String key, UpdateStreamKeyRequest request) {
        StreamKey streamKey = streamKeyRepository.findById(key)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Stream key not found"));

        if (request.getStreamUrl() != null) {
            streamKey.setStreamUrl(request.getStreamUrl());
        }
        if (request.getIsActive() != null) {
            streamKey.setIsActive(request.getIsActive());
        }

        return streamKeyMapper.toStreamKeyResponse(streamKeyRepository.save(streamKey));
    }

    public void delete(String key) {
        if (!streamKeyRepository.existsById(key)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Stream key not found");
        }
        streamKeyRepository.deleteById(key);
    }

    private void validateCreateRequest(CreateStreamKeyRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "User ID is required");
        }
        if (request.getStreamKey() == null || request.getStreamKey().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Stream key is required");
        }
        if (request.getStreamUrl() == null || request.getStreamUrl().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Stream URL is required");
        }
    }
}
