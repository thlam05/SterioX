import apiClient from "@/services/apiClient";
import type { CategoryResponse } from "@/types/category";
import type { ApiResponse } from "@/types/api";

export const categoryService = {
    getCategories() {
        return apiClient.get<ApiResponse<CategoryResponse[]>>("/categories");
    }
}