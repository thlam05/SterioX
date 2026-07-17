package com.thlam05.steriox.modules.stream.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.CategoryResponse;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.entity.Stream;

@Mapper(componentModel = "spring")
public interface StreamMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "onStream", ignore = true)
    @Mapping(target = "playUrl", ignore = true)
    @Mapping(target = "totalViews", ignore = true)
    @Mapping(target = "totalLikes", ignore = true)
    @Mapping(target = "startedAt", ignore = true)
    @Mapping(target = "endedAt", ignore = true)
    Stream toStream(CreateStreamRequest request);

    default StreamResponse toStreamResponse(Stream stream) {
        if (stream == null) {
            return null;
        }
        StreamResponse response = new StreamResponse();
        response.setId(stream.getId());
        response.setUserId(stream.getUser() != null ? stream.getUser().getId() : null);
        response.setUsername(stream.getUser() != null ? stream.getUser().getUsername() : null);
        response.setAvatarImageUrl(stream.getUser() != null ? stream.getUser().getAvatarImageUrl() : null);
        response.setCategories(toCategoryResponses(stream.getCategories()));
        response.setTitle(stream.getTitle());
        response.setDescription(stream.getDescription());
        response.setIsActive(stream.getIsActive());
        response.setOnStream(stream.getOnStream());
        response.setPlayUrl(stream.getPlayUrl());
        response.setThumbnail(stream.getThumbnail());
        response.setTotalViews(stream.getTotalViews());
        response.setTotalLikes(stream.getTotalLikes());
        response.setStartedAt(stream.getStartedAt());
        response.setEndedAt(stream.getEndedAt());
        response.setCreatedAt(stream.getCreatedAt());
        return response;
    }

    default List<StreamResponse> toStreamResponses(List<Stream> streams) {
        if (streams == null) {
            return null;
        }
        return streams.stream()
                .map(this::toStreamResponse)
                .collect(Collectors.toList());
    }

    default List<CategoryResponse> toCategoryResponses(Set<Category> categories) {
        if (categories == null) {
            return Collections.emptyList();
        }
        return categories.stream()
                .map(c -> new CategoryResponse(c.getId(), c.getName(), c.getSlug()))
                .collect(Collectors.toList());
    }
}
