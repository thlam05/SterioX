package com.thlam05.steriox.modules.stream.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.stream.constant.StreamMessage;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.entity.Stream;
import com.thlam05.steriox.modules.stream.mapper.StreamMapper;
import com.thlam05.steriox.modules.stream.repository.StreamRepository;
import com.thlam05.steriox.modules.user.entity.User;
import com.thlam05.steriox.modules.user.repository.UserRepository;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StreamService {

    private final StreamRepository streamRepository;
    private final UserRepository userRepository;
    private final StreamMapper streamMapper;
    private final EntityManager entityManager;

    public StreamResponse create(CreateStreamRequest request, String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.USER_NOT_FOUND));

        Stream stream = streamMapper.toStream(request);
        stream.setUser(user);
        stream.setIsActive(false);
        stream.setOnStream(false);
        stream.setTotalViews(0);
        stream.setTotalLikes(0);

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>();
            for (String categoryId : request.getCategoryIds()) {
                Category category = entityManager.getReference(Category.class, categoryId);
                categories.add(category);
            }
            stream.setCategories(categories);
        }

        stream = streamRepository.save(stream);
        return streamMapper.toStreamResponse(stream);
    }

    public StreamResponse getById(String id) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.STREAM_NOT_FOUND));
        return streamMapper.toStreamResponse(stream);
    }

    public List<StreamResponse> getAll() {
        List<Stream> streams = streamRepository.findAll();
        return streamMapper.toStreamResponses(streams);
    }

    public List<StreamResponse> getByUserId(String userId) {
        List<Stream> streams = streamRepository.findByUserId(userId);
        return streamMapper.toStreamResponses(streams);
    }

    public StreamResponse update(String id, UpdateStreamRequest request, String userId) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.STREAM_NOT_FOUND));

        if (!stream.getUser().getId().equals(userId)) {
            throw new AppException(ResponseCode.FORBIDDEN, StreamMessage.CAN_ONLY_UPDATE_OWN_STREAMS);
        }

        if (request.getTitle() != null) {
            stream.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            stream.setDescription(request.getDescription());
        }
        if (request.getThumbnail() != null) {
            stream.setThumbnail(request.getThumbnail());
        }
        if (request.getCategoryIds() != null) {
            Set<Category> categories = new HashSet<>();
            for (String categoryId : request.getCategoryIds()) {
                Category category = entityManager.getReference(Category.class, categoryId);
                categories.add(category);
            }
            stream.setCategories(categories);
        }

        stream = streamRepository.save(stream);
        return streamMapper.toStreamResponse(stream);
    }

    public void delete(String id, String userId) {
        Stream stream = streamRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.STREAM_NOT_FOUND));

        if (!stream.getUser().getId().equals(userId)) {
            throw new AppException(ResponseCode.FORBIDDEN, StreamMessage.CAN_ONLY_DELETE_OWN_STREAMS);
        }

        streamRepository.delete(stream);
    }
}
