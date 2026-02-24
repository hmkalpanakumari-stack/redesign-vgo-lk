import { apiClient } from './apiClient';
import type { Review } from '@/types/order';
import type { PaginatedResponse } from './productService';

export interface CreateReviewRequest {
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
}

export interface ReviewSummary {
    averageRating: number;
    totalReviews: number;
    distribution: Record<number, number>;
}

export interface ProductReviewsResponse {
    reviews: PaginatedResponse<Review>;
    summary: ReviewSummary;
}

export const reviewService = {
    async getProductReviews(
        productId: string,
        page: number = 1,
        limit: number = 10,
        sort: 'newest' | 'highest-rating' | 'lowest-rating' | 'most-helpful' = 'newest'
    ): Promise<ProductReviewsResponse> {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            sort
        });

        return apiClient.get<ProductReviewsResponse>(`/products/${productId}/reviews?${params.toString()}`);
    },

    async createReview(productId: string, review: CreateReviewRequest): Promise<Review> {
        return apiClient.post<Review>(`/products/${productId}/reviews`, review);
    },

    async markReviewHelpful(reviewId: string): Promise<{ helpfulCount: number }> {
        return apiClient.put<{ helpfulCount: number }>(`/reviews/${reviewId}/helpful`);
    }
};
