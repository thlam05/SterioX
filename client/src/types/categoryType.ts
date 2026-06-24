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