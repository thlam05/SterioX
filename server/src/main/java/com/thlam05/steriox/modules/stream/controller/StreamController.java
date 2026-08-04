package com.thlam05.steriox.modules.stream.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.dto.ApiResponse;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamResponse;
import com.thlam05.steriox.modules.stream.service.StreamService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class StreamController {

    private final StreamService streamService;

    @PostMapping("/streams")
    public ApiResponse<StreamResponse> create(@RequestBody CreateStreamRequest request, Authentication authentication) {
        String userId = authentication.getName();
        StreamResponse response = streamService.create(request, userId);
        return new ApiResponse<>(response);
    }

    @PostMapping("/streams/{id}/views")
    public String viewStream(@PathVariable String id) {
        return "";
    }

    @GetMapping("/streams")
    public ApiResponse<List<StreamResponse>> getAll(@RequestParam(required = false) String userId) {
        List<StreamResponse> response;
        if (userId != null) {
            response = streamService.getByUserId(userId);
        } else {
            response = streamService.getAll();
        }
        return new ApiResponse<>(response);
    }

    @GetMapping("/streams/{id}")
    public ApiResponse<StreamResponse> getById(@PathVariable String id) {
        StreamResponse response = streamService.getById(id);
        return new ApiResponse<>(response);
    }

    @PutMapping("/streams/{id}")
    public ApiResponse<StreamResponse> update(@PathVariable String id, @RequestBody UpdateStreamRequest request,
            Authentication authentication) {
        String userId = authentication.getName();
        StreamResponse response = streamService.update(id, request, userId);
        return new ApiResponse<>(response);
    }

    @DeleteMapping("/streams/{id}")
    public ApiResponse<?> delete(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        streamService.delete(id, userId);
        return new ApiResponse<>(ResponseCode.SUCCESS);
    }
}
