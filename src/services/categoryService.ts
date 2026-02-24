import { apiClient } from './apiClient';
import type { Category } from '@/types/product';

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        return apiClient.get<Category[]>('/categories');
    },

    async getCategoryById(id: string): Promise<Category> {
        return apiClient.get<Category>(`/categories/${id}`);
    },

    async getCategoryBySlug(slug: string): Promise<Category> {
        return apiClient.get<Category>(`/categories/slug/${slug}`);
    }
};
