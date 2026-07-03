package com.thlam05.steriox.modules.stream.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.thlam05.steriox.modules.rbac.entity.Role;
import com.thlam05.steriox.modules.stream.dto.response.StreamChatResponse;
import com.thlam05.steriox.modules.stream.entity.StreamChat;

@Mapper(componentModel = "spring")
public interface StreamChatMapper {
    @Mapping(target = "streamId", source = "stream.id")
    StreamChatResponse toStreamChatResponse(StreamChat streamChat);

    List<StreamChatResponse> toStreamChatResponses(List<StreamChat> streamChats);

    default List<String> map(Set<Role> value) {
        if (value == null || value.isEmpty()) {
            return Collections.emptyList();
        }

        return value.stream()
                .map(Role::getName)
                .toList();
    }
}
