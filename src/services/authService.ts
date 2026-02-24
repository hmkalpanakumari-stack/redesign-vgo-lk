
import { apiClient } from './apiClient';
import type { User } from '@/types/user';

export interface LoginRequest {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        apiClient.setToken(response.token);
        return response;
    },

    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        apiClient.setToken(response.token);
        return response;
    },

    async getCurrentUser(): Promise<User> {
        return apiClient.get<User>('/auth/me');
    },

    async logout(): Promise<void> {
        await apiClient.post('/auth/logout');
        apiClient.setToken(null);
    },

    isAuthenticated(): boolean {
        return !!apiClient.getToken();
    },

    getToken(): string | null {
        return apiClient.getToken();
    }
};
