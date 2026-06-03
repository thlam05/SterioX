package com.thlam05.steriox.modules.stream.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.response.ApiResponse;
import com.thlam05.steriox.modules.stream.dto.request.CreateStreamRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateStreamRequest;
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

    @GetMapping
    public ApiResponse<List<StreamResponse>> getAll() {
        return new ApiResponse<>(streamService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<StreamResponse> getById(@PathVariable String id) {
        return new ApiResponse<>(streamService.getById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<StreamResponse> update(@PathVariable String id, @RequestBody UpdateStreamRequest request) {
        return new ApiResponse<>(streamService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        streamService.delete(id);
        return new ApiResponse<>(null);
    }
}
