package com.thlam05.steriox.modules.stream.service;

import java.util.List;

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

    public CategoryResponse create(CreateCategoryRequest request) {
        Category category = categoryMapper.toCategory(request);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public CategoryResponse getById(String id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Category not found"));
        return categoryMapper.toCategoryResponse(category);
    }

    public List<CategoryResponse> getAll() {
        return categoryMapper.toCategoryResponses(categoryRepository.findAll());
    }

    public CategoryResponse update(String id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ResponseStatus.NOT_FOUND, "Category not found"));

        categoryMapper.updateCategoryFromRequest(request, category);
        return categoryMapper.toCategoryResponse(categoryRepository.save(category));
    }

    public void delete(String id) {
        if (!categoryRepository.existsById(id)) {
            throw new AppException(ResponseStatus.NOT_FOUND, "Category not found");
        }
        categoryRepository.deleteById(id);
    }
}
