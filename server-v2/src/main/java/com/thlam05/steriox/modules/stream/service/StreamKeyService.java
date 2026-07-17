package com.thlam05.steriox.modules.stream.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.stream.constant.StreamMessage;
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

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.USER_NOT_FOUND));

        StreamKey streamKey = streamKeyRepository.findByUserId(request.getUserId())
                .orElse(new StreamKey());

        String generatedKey = generateUniqueStreamKey();
        String streamUrl = generateStreamUrl(generatedKey);

        streamKey.setStreamKey(generatedKey);
        streamKey.setUser(user);
        streamKey.setStreamUrl(streamUrl);

        StreamKey savedKey = streamKeyRepository.save(streamKey);
        return streamKeyMapper.toStreamKeyResponse(savedKey);
    }

    private String generateUniqueStreamKey() {
        String key;
        do {
            key = UUID.randomUUID().toString().replace("-", "");
        } while (streamKeyRepository.existsById(key));
        return key;
    }

    private String generateStreamUrl(String streamKey) {
        return StreamMessage.RTMP_BASE_URL;
    }

    public List<StreamKeyResponse> getAll() {
        return streamKeyMapper.toStreamKeyResponses(streamKeyRepository.findAll());
    }

    public StreamKeyResponse getByKey(String key) {
        StreamKey streamKey = streamKeyRepository.findById(key)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.STREAM_KEY_NOT_FOUND));
        return streamKeyMapper.toStreamKeyResponse(streamKey);
    }

    public StreamKeyResponse getByUserId(String userId) {
        StreamKey streamKey = streamKeyRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND));

        return streamKeyMapper.toStreamKeyResponse(streamKey);
    }

    public StreamKeyResponse update(String key, UpdateStreamKeyRequest request) {
        StreamKey streamKey = streamKeyRepository.findById(key)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.STREAM_KEY_NOT_FOUND));

        if (request.getStreamUrl() != null) {
            streamKey.setStreamUrl(request.getStreamUrl());
        }

        return streamKeyMapper.toStreamKeyResponse(streamKeyRepository.save(streamKey));
    }

    public void delete(String key) {
        if (!streamKeyRepository.existsById(key)) {
            throw new AppException(ResponseCode.NOT_FOUND, StreamMessage.STREAM_KEY_NOT_FOUND);
        }
        streamKeyRepository.deleteById(key);
    }

    private void validateCreateRequest(CreateStreamKeyRequest request) {
        if (request.getUserId() == null || request.getUserId().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.USER_ID_REQUIRED);
        }
    }
}
