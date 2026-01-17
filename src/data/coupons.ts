import type { Coupon } from '@/types/order'

export const coupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minOrderAmount: 2000,
    maxDiscount: 5000,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    usageLimit: 1,
    usageCount: 0,
    isActive: true,
    description: '10% off on your first order (max Rs. 5,000 discount)',
  },
  {
    id: 'coupon-2',
    code: 'SAVE500',
    type: 'fixed',
    value: 500,
    minOrderAmount: 5000,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-03-31T23:59:59Z',
    usageLimit: 100,
    usageCount: 45,
    isActive: true,
    description: 'Rs. 500 off on orders above Rs. 5,000',
  },
  {
    id: 'coupon-3',
    code: 'FLASH20',
    type: 'percentage',
    value: 20,
    minOrderAmount: 10000,
    maxDiscount: 10000,
    validFrom: '2024-01-15T00:00:00Z',
    validUntil: '2024-01-20T23:59:59Z',
    usageLimit: 50,
    usageCount: 32,
    isActive: true,
    description: 'Flash sale! 20% off (max Rs. 10,000 discount)',
    applicableCategories: ['electronics'],
  },
  {
    id: 'coupon-4',
    code: 'FASHION15',
    type: 'percentage',
    value: 15,
    minOrderAmount: 3000,
    maxDiscount: 3000,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-06-30T23:59:59Z',
    usageLimit: 200,
    usageCount: 89,
    isActive: true,
    description: '15% off on fashion items (max Rs. 3,000 discount)',
    applicableCategories: ['fashion'],
  },
  {
    id: 'coupon-5',
    code: 'FREESHIP',
    type: 'fixed',
    value: 350,
    minOrderAmount: 2000,
    validFrom: '2024-01-01T00:00:00Z',
    validUntil: '2024-12-31T23:59:59Z',
    isActive: true,
    description: 'Free standard shipping on orders above Rs. 2,000',
  },
]

export function validateCoupon(code: string, cartTotal: number, categorySlug?: string): {
  isValid: boolean
  coupon?: Coupon
  error?: string
  discount?: number
} {
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase())

  if (!coupon) {
    return { isValid: false, error: 'Invalid coupon code' }
  }

  if (!coupon.isActive) {
    return { isValid: false, error: 'This coupon is no longer active' }
  }

  const now = new Date()
  if (new Date(coupon.validFrom) > now) {
    return { isValid: false, error: 'This coupon is not yet valid' }
  }

  if (new Date(coupon.validUntil) < now) {
    return { isValid: false, error: 'This coupon has expired' }
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { isValid: false, error: 'This coupon has reached its usage limit' }
  }

  if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
    return {
      isValid: false,
      error: `Minimum order amount is Rs. ${coupon.minOrderAmount.toLocaleString()}`,
    }
  }

  if (coupon.applicableCategories && categorySlug) {
    if (!coupon.applicableCategories.includes(categorySlug)) {
      return { isValid: false, error: 'This coupon is not valid for this category' }
    }
  }

  let discount: number
  if (coupon.type === 'percentage') {
    discount = Math.round(cartTotal * (coupon.value / 100))
    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount)
    }
  } else {
    discount = coupon.value
  }

  return { isValid: true, coupon, discount }
}

export function getCouponByCode(code: string): Coupon | undefined {
  return coupons.find(c => c.code.toUpperCase() === code.toUpperCase())
}

export function getActiveCoupons(): Coupon[] {
  const now = new Date()
  return coupons.filter(c =>
    c.isActive &&
    new Date(c.validFrom) <= now &&
    new Date(c.validUntil) >= now &&
    (!c.usageLimit || c.usageCount < c.usageLimit)
  )
}
