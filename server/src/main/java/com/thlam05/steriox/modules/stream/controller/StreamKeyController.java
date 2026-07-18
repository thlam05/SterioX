package com.thlam05.steriox.modules.stream.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.dto.ApiResponse;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamKeyRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateStreamKeyRequest;
import com.thlam05.steriox.modules.stream.dto.response.StreamKeyResponse;
import com.thlam05.steriox.modules.stream.service.StreamKeyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/stream-keys")
@RequiredArgsConstructor
public class StreamKeyController {
    private final StreamKeyService streamKeyService;

    @PostMapping
    public ApiResponse<StreamKeyResponse> create(@RequestBody CreateStreamKeyRequest request) {
        return new ApiResponse<>(streamKeyService.create(request));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<StreamKeyResponse> getByUserId(@PathVariable String userId) {
        return new ApiResponse<>(streamKeyService.getByUserId(userId));
    }

    @GetMapping("/{key}")
    public ApiResponse<StreamKeyResponse> getByKey(@PathVariable String key) {
        return new ApiResponse<>(streamKeyService.getByKey(key));
    }

    @PutMapping("/{key}")
    public ApiResponse<StreamKeyResponse> update(@PathVariable String key,
            @RequestBody UpdateStreamKeyRequest request) {
        return new ApiResponse<>(streamKeyService.update(key, request));
    }

    @DeleteMapping("/{key}")
    public ApiResponse<?> delete(@PathVariable String key) {
        streamKeyService.delete(key);
        return new ApiResponse<>(null);
    }
}
