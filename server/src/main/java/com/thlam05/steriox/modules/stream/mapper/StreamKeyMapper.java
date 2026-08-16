package com.thlam05.steriox.modules.stream.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.stream.dto.request.CreateStreamKeyRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamKeyResponse;
import com.thlam05.steriox.modules.stream.entity.StreamKey;

@Mapper(componentModel = "spring")
public interface StreamKeyMapper {

    @Mapping(target = "streamKey", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "streamUrl", ignore = true)
    StreamKey toStreamKey(CreateStreamKeyRequest request);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(target = "updatedAt", ignore = true)
    StreamKeyResponse toStreamKeyResponse(StreamKey entity);

    List<StreamKeyResponse> toStreamKeyResponses(List<StreamKey> entities);
}