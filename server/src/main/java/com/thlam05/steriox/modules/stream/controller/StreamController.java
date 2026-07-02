package com.thlam05.steriox.modules.stream.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.response.ApiResponse;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.LivestreamLikeStatusResponse;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.service.StreamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/streams")
@RequiredArgsConstructor
public class StreamController {
    private final StreamService streamService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<StreamResponse> create(@ModelAttribute CreateStreamRequest request) throws IOException {
        return new ApiResponse<>(streamService.create(request));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<StreamResponse> getStreamOnlineByUserId(@PathVariable String userId) {
        return new ApiResponse<>(streamService.getStreamOnlineByUserId(userId));
    }

    @GetMapping("/{id}")
    public ApiResponse<StreamResponse> getById(@PathVariable String id) {
        return new ApiResponse<>(streamService.getById(id));
    }

    @GetMapping("/top")
    public ApiResponse<List<StreamResponse>> getTopStream() {
        return new ApiResponse<>(streamService.getTopStream());
    }

    @GetMapping("/like-status/{id}")
    public ApiResponse<LivestreamLikeStatusResponse> getSatusLiked(@PathVariable String id) {
        return new ApiResponse<>(streamService.checkIsLikedStream(id));
    }

    @PatchMapping("/start/{id}")
    public ApiResponse<StreamResponse> startStream(@PathVariable String id) {
        return new ApiResponse<>(streamService.startStream(id));
    }

    @PatchMapping("/stop/{id}")
    public ApiResponse<StreamResponse> stopStream(@PathVariable String id) {
        return new ApiResponse<>(streamService.stopStream(id));
    }

    @PostMapping("/like/{id}")
    public ApiResponse<?> likeStream(@PathVariable String id) {
        streamService.likeStream(id);
        return new ApiResponse<>(ResponseStatus.SUCCESS);
    }

    @PostMapping("/unlike/{id}")
    public ApiResponse<?> unlikeStream(@PathVariable String id) {
        streamService.unlikeStream(id);
        return new ApiResponse<>(ResponseStatus.SUCCESS);
    }

    // @DeleteMapping("/{id}")
    // public ApiResponse<?> delete(@PathVariable String id) {
    // streamService.delete(id);
    // return new ApiResponse<>(null);
    // }
}
