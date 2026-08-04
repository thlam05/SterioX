package com.thlam05.steriox.modules.stream.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.entity.Stream;

@Mapper(componentModel = "spring", uses = {CategoryMapper.class})
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

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.username", target = "username")
    @Mapping(source = "user.avatarImageUrl", target = "avatarImageUrl")
    StreamResponse toStreamResponse(Stream stream);

    List<StreamResponse> toStreamResponses(List<Stream> streams);
}