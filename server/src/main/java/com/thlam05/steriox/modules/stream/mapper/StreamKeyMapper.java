package com.thlam05.steriox.modules.stream.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.stream.dto.request.CreateStreamKeyRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamKeyResponse;
import com.thlam05.steriox.modules.stream.entity.StreamKey;

@Mapper(componentModel = "spring")
public interface StreamKeyMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    StreamKey toStreamKey(CreateStreamKeyRequest request);

    default StreamKeyResponse toStreamKeyResponse(StreamKey entity) {
        if (entity == null) {
            return null;
        }

        return StreamKeyResponse.builder()
                .streamKey(entity.getStreamKey())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .streamUrl(entity.getStreamUrl())
                .isActive(entity.getIsActive())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    default List<StreamKeyResponse> toStreamKeyResponses(List<StreamKey> entities) {
        if (entities == null) {
            return null;
        }
        return entities.stream()
                .map(this::toStreamKeyResponse)
                .collect(Collectors.toList());
    }
}
