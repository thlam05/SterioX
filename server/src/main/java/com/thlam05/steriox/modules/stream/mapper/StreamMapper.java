package com.thlam05.steriox.modules.stream.mapper;

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
    @Mapping(target = "thumbnail", ignore = true)
    @Mapping(target = "totalViews", ignore = true)
    @Mapping(target = "totalLikes", ignore = true)
    @Mapping(target = "startedAt", ignore = true)
    @Mapping(target = "endedAt", ignore = true)
    @Mapping(target = "playUrl", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "onStream", ignore = true)
    Stream toStream(CreateStreamRequest request);

    default StreamResponse toStreamResponse(Stream stream) {
        if (stream == null) {
            return null;
        }

        return StreamResponse.builder()
                .id(stream.getId())
                .user(stream.getUser() != null ? stream.getUser() : null)
                .title(stream.getTitle())
                .description(stream.getDescription())
                .status(stream.getStatus())
                .isActive(stream.getIsActive())
                .onStream(stream.getOnStream())
                .thumbnail(stream.getThumbnail())
                .totalViews(stream.getTotalViews())
                .totalLikes(stream.getTotalLikes())
                .startedAt(stream.getStartedAt())
                .endedAt(stream.getEndedAt())
                .createdAt(stream.getCreatedAt())
                .latency(stream.getLatency())
                .playUrl(stream.getPlayUrl())
                .categories(toCategoryResponses(stream.getCategories()))
                .build();
    }

    default CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParentId())
                .slug(category.getSlug())
                .level(category.getLevel())
                .subCategories(null)
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }

    default Set<CategoryResponse> toCategoryResponses(Set<Category> categories) {
        if (categories == null) {
            return null;
        }

        return categories.stream()
                .map(this::toCategoryResponse)
                .collect(Collectors.toSet());
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
