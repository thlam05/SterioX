package com.thlam05.steriox.modules.stream.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.thlam05.steriox.common.enums.ResponseStatus;
import com.thlam05.steriox.common.exception.AppException;
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
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Category not found"));
        return categoryMapper.toCategoryResponse(category);
    }

    @Cacheable(value = "categories")
    public List<CategoryResponse> getAll() {
        List<CategoryResponse> allCategories = categoryMapper.toCategoryResponses(categoryRepository.findAll());
        Map<String, CategoryResponse> categoryMap = allCategories.stream()
                .collect(Collectors.toMap(CategoryResponse::getId, category -> category));

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
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Category not found"));

        validateUpdateRequest(request);
        categoryMapper.updateCategoryFromRequest(request, category);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public void delete(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private void validateCreateRequest(CreateCategoryRequest request) {
        if (request == null) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category request is required");
        }
        if (request.getParentId() != null && categoryRepository.existsById(request.getParentId()) == false) {
            System.out.println(request.getParentId());
            throw new AppException(ResponseStatus.NOT_FOUND, "Parent category is not found");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category name is required");
        }
        if (request.getSlug() == null || request.getSlug().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category slug is required");
        }
        if (request.getLevel() != null && request.getLevel() < 0) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category level must not be negative");
        }
    }

    private void validateUpdateRequest(UpdateCategoryRequest request) {
        if (request == null) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category update request is required");
        }
        if (request.getParentId() != null && categoryRepository.existsById(request.getParentId()) == false) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Parent category is not found");
        }
        if (request.getName() != null && request.getName().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category name must not be blank");
        }
        if (request.getSlug() != null && request.getSlug().isBlank()) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category slug must not be blank");
        }
        if (request.getLevel() != null && request.getLevel() < 0) {
            throw new AppException(ResponseStatus.BAD_REQUEST, "Category level must not be negative");
        }
    }
}
