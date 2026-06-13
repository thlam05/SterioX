package com.thlam05.steriox.modules.stream.mapper;

import java.util.List;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import com.thlam05.steriox.modules.stream.dto.request.CreateCategoryRequest;
import com.thlam05.steriox.modules.stream.dto.request.UpdateCategoryRequest;
import com.thlam05.steriox.modules.stream.dto.response.CategoryResponse;
import com.thlam05.steriox.modules.stream.entity.Category;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "streams", ignore = true)
    Category toCategory(CreateCategoryRequest request);

    @Mapping(target = "subCategories", ignore = true)
    CategoryResponse toCategoryResponse(Category category);

    List<CategoryResponse> toCategoryResponses(List<Category> categories);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "streams", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateCategoryFromRequest(UpdateCategoryRequest request, @MappingTarget Category category);
}
