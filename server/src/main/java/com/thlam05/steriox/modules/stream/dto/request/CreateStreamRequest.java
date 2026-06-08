package com.thlam05.steriox.modules.stream.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateStreamRequest {
    String userId;
    String title;
    String description;
    String status;
    String latency;
    boolean dvr;
    boolean vod;
    MultipartFile thumbnail;
    List<String> categoryIds;
}
