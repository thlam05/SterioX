package com.thlam05.steriox.modules.stream.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.response.ApiResponse;
import com.thlam05.steriox.modules.stream.dto.request.CreateCategoryRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateCategoryRequest;
import com.thlam05.steriox.modules.stream.dto.response.CategoryResponse;
import com.thlam05.steriox.modules.stream.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ApiResponse<CategoryResponse> create(@RequestBody CreateCategoryRequest request) {
        return new ApiResponse<>(categoryService.create(request));
    }

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAll() {
        return new ApiResponse<>(categoryService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getById(@PathVariable String id) {
        return new ApiResponse<>(categoryService.getById(id));
    }

    @PutMapping("/{id}")
    public ApiResponse<CategoryResponse> update(@PathVariable String id, @RequestBody UpdateCategoryRequest request) {
        return new ApiResponse<>(categoryService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> delete(@PathVariable String id) {
        categoryService.delete(id);
        return new ApiResponse<>(ResponseStatus.SUCCESS);
    }
}
