import { api, type ApiResponse } from "@/api/apiClient";

export type CategoryResponse = {
  id: string;
  name: string;
  parentId: string;
  slug: string;
  level: number;
  subCategories: CategoryResponse[];
  createdAt: Date;
  updatedAt: Date;
};

export type CreateCategoryRequest = {
  name: string;
  parentId: string;
  slu: string;
  level: number;
};

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
