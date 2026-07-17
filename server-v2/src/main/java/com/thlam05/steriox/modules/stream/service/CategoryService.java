package com.thlam05.steriox.modules.stream.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.constant.ResponseCode;
import com.thlam05.steriox.common.exception.AppException;
import com.thlam05.steriox.modules.stream.constant.StreamMessage;
import com.thlam05.steriox.modules.stream.dto.request.CreateCategoryRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateCategoryRequest;
import com.thlam05.steriox.modules.stream.dto.response.CategoryResponse;
import com.thlam05.steriox.modules.stream.entity.Category;
import com.thlam05.steriox.modules.stream.mapper.CategoryMapper;
import com.thlam05.steriox.modules.stream.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse create(CreateCategoryRequest request) {
        validateCreateRequest(request);

        Category category = categoryMapper.toCategory(request);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public CategoryResponse getById(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.CATEGORY_NOT_FOUND));
        return categoryMapper.toCategoryResponse(category);
    }

    @Cacheable(value = "categories")
    public List<CategoryResponse> getAll() {
        List<CategoryResponse> allCategories = categoryMapper.toCategoryResponses(categoryRepository.findAll());
        Map<String, CategoryResponse> categoryMap = allCategories.stream()
                .collect(Collectors.toMap(category -> category.getId(), category -> category));

        List<CategoryResponse> categories = new ArrayList<>();

        for (CategoryResponse category : allCategories) {
            String parentId = category.getParentId();

            if (parentId == null || parentId.isEmpty()) {
                categories.add(category);
            } else {
                CategoryResponse parent = categoryMap.get(parentId);
                if (parent != null) {
                    if (parent.getSubCategories() == null) {
                        parent.setSubCategories(new HashSet<>());
                    }
                    parent.getSubCategories().add(category);
                }
            }
        }

        return categories;
    }

    public CategoryResponse update(String id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseCode.NOT_FOUND, StreamMessage.CATEGORY_NOT_FOUND));

        validateUpdateRequest(request);
        categoryMapper.updateCategoryFromRequest(request, category);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public void delete(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ResponseCode.NOT_FOUND, StreamMessage.CATEGORY_NOT_FOUND);
        }
        categoryRepository.deleteById(id);
    }

    private void validateCreateRequest(CreateCategoryRequest request) {
        if (request == null) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_REQUEST_REQUIRED);
        }
        if (request.getParentId() != null && !categoryRepository.existsById(request.getParentId())) {
            throw new AppException(ResponseCode.NOT_FOUND, StreamMessage.PARENT_CATEGORY_NOT_FOUND);
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_NAME_REQUIRED);
        }
        if (request.getSlug() == null || request.getSlug().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_SLUG_REQUIRED);
        }
        if (request.getLevel() != null && request.getLevel() < 0) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_LEVEL_NON_NEGATIVE);
        }
    }

    private void validateUpdateRequest(UpdateCategoryRequest request) {
        if (request == null) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_UPDATE_REQUEST_REQUIRED);
        }
        if (request.getParentId() != null && !categoryRepository.existsById(request.getParentId())) {
            throw new AppException(ResponseCode.NOT_FOUND, StreamMessage.PARENT_CATEGORY_NOT_FOUND);
        }
        if (request.getName() != null && request.getName().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_NAME_NOT_BLANK);
        }
        if (request.getSlug() != null && request.getSlug().isBlank()) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_SLUG_NOT_BLANK);
        }
        if (request.getLevel() != null && request.getLevel() < 0) {
            throw new AppException(ResponseCode.BAD_REQUEST, StreamMessage.CATEGORY_LEVEL_NON_NEGATIVE);
        }
    }
}
