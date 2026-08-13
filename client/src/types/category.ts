export interface CategoryResponse {
  id: string;
  name: string;
  parentId?: string | null;
  slug: string;
  level: number;
  subCategories?: CategoryResponse[];
  createdAt?: string;
  updatedAt?: string;
}
