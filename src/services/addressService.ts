import { apiClient } from './apiClient';
import type { Address } from '@/types/user';

export interface CreateAddressRequest {
    label: string;
    firstName: string;
    lastName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    type: string;
}

export const addressService = {
    async getAddresses(): Promise<Address[]> {
        return apiClient.get<Address[]>('/auth/me/addresses');
    },

    async createAddress(data: CreateAddressRequest): Promise<Address> {
        return apiClient.post<Address>('/auth/me/addresses', data);
    },
};
