package com.thlam05.steriox.modules.stream.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.entity.Stream;

@Mapper(componentModel = "spring")
public interface StreamMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "thumbnail", ignore = true)
    @Mapping(target = "currentViewers", ignore = true)
    @Mapping(target = "maxViewers", ignore = true)
    @Mapping(target = "totalLikes", ignore = true)
    @Mapping(target = "startedAt", ignore = true)
    @Mapping(target = "endedAt", ignore = true)
    @Mapping(target = "playUrl", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "categories", ignore = true)
    Stream toStream(CreateStreamRequest request);

    default StreamResponse toStreamResponse(Stream stream) {
        if (stream == null) {
            return null;
        }

        return StreamResponse.builder()
                .id(stream.getId())
                .userId(stream.getUser() != null ? stream.getUser().getId() : null)
                .title(stream.getTitle())
                .description(stream.getDescription())
                .status(stream.getStatus())
                .isActive(stream.getIsActive())
                .thumbnail(stream.getThumbnail())
                .currentViewers(stream.getCurrentViewers())
                .maxViewers(stream.getMaxViewers())
                .totalLikes(stream.getTotalLikes())
                .startedAt(stream.getStartedAt())
                .endedAt(stream.getEndedAt())
                .createdAt(stream.getCreatedAt())
                .latency(stream.getLatency())
                .playUrl(stream.getPlayUrl())
                .categoryIds(stream.getCategories() != null
                        ? stream.getCategories().stream().map(Category::getId).collect(Collectors.toList())
                        : null)
                .build();
    }

    default List<StreamResponse> toStreamResponses(List<Stream> streams) {
        if (streams == null) {
            return null;
        }
        return streams.stream()
                .map(this::toStreamResponse)
                .collect(Collectors.toList());
    }
}
