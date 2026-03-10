import { API_BASE_URL } from './apiClient';

const ADMIN_TOKEN_KEY = 'admin_token';

// Set by AdminLayout so 401/403 use React Router navigate (no hard reload)
let _onUnauthorized: (() => void) | null = null;

function getToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    if (_onUnauthorized) _onUnauthorized();
    throw new Error('Session expired. Please log in again.');
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}: ${res.statusText}`);
  return data.data ?? data;
}

export const adminService = {
  getToken,
  isLoggedIn: () => !!getToken(),
  setUnauthorizedCallback: (fn: () => void) => { _onUnauthorized = fn; },
  clearUnauthorizedCallback: () => { _onUnauthorized = null; },

  async login(email: string, password: string) {
    // Use raw fetch so wrong-credential 401 shows form error, not a redirect
    const res = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const text = await res.text();
    const json = text ? JSON.parse(text) : {};
    if (!res.ok) throw new Error(json?.error || 'Invalid credentials');
    const data = json.data ?? json;
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    return data;
  },

  logout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  getStats: () => request<AdminStats>('/admin/stats'),

  getOrders: (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.status) q.set('status', params.status);
    if (params?.search) q.set('search', params.search);
    return request<AdminOrderPage>(`/admin/orders?${q}`);
  },

  getOrder: (id: string) => request<OrderDetail>(`/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: string, note?: string) =>
    request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    }),

  createProduct: (data: CreateProductRequest) =>
    request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),

  getProducts: (params?: { page?: number; limit?: number; search?: string; category?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    if (params?.category) q.set('category', params.category);
    return request<AdminProductPage>(`/admin/products?${q}`);
  },

  deleteProduct: (id: string) =>
    request(`/admin/products/${id}`, { method: 'DELETE' }),

  updateProductStatus: (id: string, data: UpdateProductStatusRequest) =>
    request(`/admin/products/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  getUsers: (params?: { page?: number; limit?: number; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    return request<AdminUserPage>(`/admin/users?${q}`);
  },

  getUser: (id: string) => request<AdminUserDetail>(`/admin/users/${id}`),
};

export interface AdminStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingOrders: number;
  processingOrders: number;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface AdminOrderPage {
  data: AdminOrder[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateProductRequest {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  subCategory?: string;
  brand?: string;
  sku: string;
  stock: number;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  isBestSeller?: boolean;
  warranty?: string;
  deliveryInfo?: string;
}

export interface AdminProductListItem {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  categoryName: string;
  stock: number;
  price: number;
  isOnSale: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  createdAt: string;
}

export interface UpdateProductStatusRequest {
  stock?: number;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  isBestSeller: boolean;
}

export interface AdminProductPage {
  data: AdminProductListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isVerified: boolean;
  orderCount: number;
  createdAt: string;
}

export interface AdminUserPage {
  data: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AdminUserDetail {
  user: {
    id: string; email: string; firstName: string; lastName: string;
    phone?: string; isVerified: boolean; createdAt: string;
  };
  orders: AdminOrder[];
  totalOrders: number;
  totalSpent: number;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  items: { productName: string; quantity: number; unitPrice: number; totalPrice: number }[];
  shippingAddress: { firstName: string; lastName: string; addressLine1: string; city: string; phone: string };
  shippingMethod: { name: string; price: number };
  paymentMethod: { name: string };
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: string;
  statusHistory: { status: string; note?: string; createdAt: string }[];
  createdAt: string;
}
