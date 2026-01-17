import type { Product, ProductVariant } from './product'
import type { Address } from './user'

export type { Address }

export interface CartItem {
  id: string
  product: Product
  variant?: ProductVariant
  quantity: number
  addedAt: string
}

export interface CartState {
  items: CartItem[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  couponCode?: string
  couponDiscount?: number
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon?: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'cod' | 'bank' | 'wallet'
  name: string
  description?: string
  icon?: string
  isAvailable: boolean
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productImage: string
  variantId?: string
  variantName?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded'

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  note?: string
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  items: OrderItem[]
  shippingAddress: Address
  billingAddress?: Address
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  subtotal: number
  shippingCost: number
  discount: number
  tax: number
  total: number
  couponCode?: string
  status: OrderStatus
  statusHistory: OrderStatusHistory[]
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minOrderAmount?: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  usageLimit?: number
  usageCount: number
  isActive: boolean
  description?: string
  applicableCategories?: string[]
  applicableProducts?: string[]
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title?: string
  comment: string
  images?: string[]
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
  updatedAt?: string
}

export interface CheckoutState {
  step: 'login' | 'address' | 'shipping' | 'payment' | 'confirmation'
  guestEmail?: string
  shippingAddress?: Address
  billingAddress?: Address
  shippingMethod?: ShippingMethod
  paymentMethod?: PaymentMethod
  sameAsBilling: boolean
}
