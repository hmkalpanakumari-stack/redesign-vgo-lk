import { apiClient } from './apiClient';

export interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    description?: string;
    validUntil: string;
}

export interface CouponValidationRequest {
    code: string;
    cartTotal: number;
    categorySlug?: string;
}

export interface CouponValidationResponse {
    isValid: boolean;
    coupon?: Coupon;
    error?: string;
    discount?: number;
}

export const couponService = {
    async validateCoupon(data: CouponValidationRequest): Promise<CouponValidationResponse> {
        return apiClient.post<CouponValidationResponse>('/coupons/validate', data);
    },

    async getActiveCoupons(): Promise<Coupon[]> {
        return apiClient.get<Coupon[]>('/coupons/active');
    }
};
