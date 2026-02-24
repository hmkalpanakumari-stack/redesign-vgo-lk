export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatarUrl?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  label: string
  firstName: string
  lastName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  district: string
  postalCode: string
  country: string
  isDefault: boolean
  type: 'home' | 'office' | 'other'
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'order' | 'promo' | 'system' | 'wishlist'
  isRead: boolean
  link?: string
  createdAt: string
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  addedAt: string
}
