import { apiClient } from './apiClient';
import type { Product } from '@/types/product';

export interface ProductFilters {
    page?: number;
    limit?: number;
    sort?: 'newest' | 'price-low-high' | 'price-high-low' | 'rating' | 'best-selling';
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    onSale?: boolean;
    search?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export const productService = {
    async getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString());
            }
        });

        const queryString = params.toString();
        const endpoint = `/products${queryString ? `?${queryString}` : ''}`;

        return apiClient.get<PaginatedResponse<Product>>(endpoint);
    },

    async getProductById(id: string): Promise<Product> {
        return apiClient.get<Product>(`/products/${id}`);
    },

    async getProductBySlug(slug: string): Promise<Product> {
        return apiClient.get<Product>(`/products/slug/${slug}`);
    },

    async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        return apiClient.get<Product[]>(`/products/featured?limit=${limit}`);
    }
};
