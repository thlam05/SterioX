import { api, type ApiResponse } from "@/api/apiClient";
import type { CategoryResponse, CreateCategoryRequest } from "@/types/categoryType";

export const categoryApi = {
  async getCategories() {
    const response = await api.get<ApiResponse<CategoryResponse[]>>("/categories");
    return response.data.data;
  },

  async createCategories(payload: CreateCategoryRequest) {
    const response = await api.post<ApiResponse<CategoryResponse>>("/categories", payload);
    return response.data.data;
  }
};
