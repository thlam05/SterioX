package com.thlam05.steriox.modules.stream.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.rbac.entity.Role;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.CategoryResponse;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.entity.Stream;

@Mapper(componentModel = "spring")
public interface StreamMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "usersLiked", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "onStream", ignore = true)
    @Mapping(target = "thumbnail", ignore = true)
    @Mapping(target = "playUrl", ignore = true)
    @Mapping(target = "totalViews", ignore = true)
    @Mapping(target = "totalLikes", ignore = true)
    @Mapping(target = "startedAt", ignore = true)
    @Mapping(target = "endedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    Stream toStream(CreateStreamRequest request);

    StreamResponse toStreamResponse(Stream stream);

    List<StreamResponse> toStreamResponses(List<Stream> streams);

    @Mapping(target = "subCategories", ignore = true)
    CategoryResponse toCategoryResponse(Category category);

    default List<String> map(Set<Role> value) {
        if (value == null || value.isEmpty()) {
            return Collections.emptyList();
        }

        return value.stream()
                .map(Role::getName)
                .toList();
    }
}
