import { apiClient } from './apiClient';
import type { Order, ShippingMethod, PaymentMethod } from '@/types/order';
import type { PaginatedResponse } from './productService';

export interface CreateOrderRequest {
    items: Array<{
        productId: string;
        variantId?: string;
        quantity: number;
    }>;
    shippingAddressId: string;
    billingAddressId?: string;
    shippingMethodId: string;
    paymentMethodId: string;
    couponCode?: string;
    notes?: string;
}

export const orderService = {
    async getOrders(page: number = 1, limit: number = 10, status?: string): Promise<PaginatedResponse<Order>> {
        const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
        if (status) params.append('status', status);

        return apiClient.get<PaginatedResponse<Order>>(`/orders?${params.toString()}`);
    },

    async getOrderById(id: string): Promise<Order> {
        return apiClient.get<Order>(`/orders/${id}`);
    },

    async createOrder(orderData: CreateOrderRequest): Promise<Order> {
        return apiClient.post<Order>('/orders', orderData);
    },

    async getShippingMethods(): Promise<ShippingMethod[]> {
        return apiClient.get<ShippingMethod[]>('/shipping-methods');
    },

    async getPaymentMethods(): Promise<PaymentMethod[]> {
        return apiClient.get<PaymentMethod[]>('/payment-methods');
    }
};
