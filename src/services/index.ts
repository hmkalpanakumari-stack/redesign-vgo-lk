// Export all services
export { apiClient, API_BASE_URL } from './apiClient';
export { authService } from './authService';
export { productService } from './productService';
export { categoryService } from './categoryService';
export { orderService } from './orderService';
export { couponService } from './couponService';
export { reviewService } from './reviewService';
export { addressService } from './addressService';

// Export types
export type { LoginRequest, RegisterRequest, AuthResponse } from './authService';
export type { ProductFilters, PaginatedResponse } from './productService';
export type { CreateOrderRequest } from './orderService';
export type { CouponValidationRequest, CouponValidationResponse, Coupon } from './couponService';
export type { CreateReviewRequest, ReviewSummary, ProductReviewsResponse } from './reviewService';
export type { CreateAddressRequest } from './addressService';
