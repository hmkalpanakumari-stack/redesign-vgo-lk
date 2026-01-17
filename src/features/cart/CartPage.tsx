import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useUI } from '@/context/UIContext'
import { formatPrice } from '@/utils/formatters'
import { validateCoupon } from '@/data/coupons'
import { getFeaturedProducts } from '@/data/products'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CartItemList } from '@/components/common/CartItem'
import { ProductCard } from '@/components/common/ProductCard'

export function CartPage() {
  const { state: cartState, applyCoupon, removeCoupon, clearCart } = useCart()
  const { showToast } = useUI()
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const recommendedProducts = getFeaturedProducts().slice(0, 4)

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code')
      return
    }

    setIsApplyingCoupon(true)
    setCouponError('')

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const result = validateCoupon(couponCode, cartState.subtotal)

    if (result.isValid && result.discount) {
      applyCoupon(couponCode, result.discount)
      showToast('success', `Coupon applied! You save ${formatPrice(result.discount)}`)
      setCouponCode('')
    } else {
      setCouponError(result.error || 'Invalid coupon code')
    }

    setIsApplyingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    showToast('info', 'Coupon removed')
  }

  const breadcrumbItems = [{ label: 'Shopping Cart' }]

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <h1 className="text-2xl font-bold text-dark mb-6">Shopping Cart</h1>

        {cartState.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-dark-muted mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-dark mb-2">Your cart is empty</h2>
            <p className="text-dark-muted mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-card">
                <div className="p-4 border-b border-light-border flex items-center justify-between">
                  <span className="font-medium text-dark">
                    {cartState.items.length} item{cartState.items.length !== 1 ? 's' : ''} in cart
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-sm text-error hover:underline"
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="p-4">
                  <CartItemList items={cartState.items} />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-dark mb-4">Order Summary</h2>

                {/* Coupon */}
                <div className="mb-6">
                  {cartState.couponCode ? (
                    <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-success">Coupon Applied</p>
                        <p className="text-xs text-dark-muted">{cartState.couponCode}</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-sm text-error hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          error={couponError}
                        />
                        <Button
                          variant="outline"
                          onClick={handleApplyCoupon}
                          isLoading={isApplyingCoupon}
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Lines */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-muted">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartState.subtotal)}</span>
                  </div>
                  {cartState.discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount</span>
                      <span>-{formatPrice(cartState.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-muted">Shipping</span>
                    <span className="font-medium">
                      {cartState.shipping === 0 ? (
                        <span className="text-success">Free</span>
                      ) : (
                        formatPrice(cartState.shipping)
                      )}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-light-border">
                    <div className="flex justify-between">
                      <span className="font-semibold text-dark">Total</span>
                      <span className="text-xl font-bold text-primary-orange">
                        {formatPrice(cartState.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout">
                  <Button variant="primary" fullWidth size="lg">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  className="block text-center text-sm text-primary-orange hover:underline mt-4"
                >
                  Continue Shopping
                </Link>

                {/* Free Shipping Notice */}
                {cartState.subtotal < 5000 && (
                  <div className="mt-4 p-3 bg-light-bg-alt rounded-lg">
                    <p className="text-sm text-dark-secondary">
                      Add <span className="font-semibold">{formatPrice(5000 - cartState.subtotal)}</span> more to qualify for <span className="font-semibold text-success">Free Shipping!</span>
                    </p>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-orange rounded-full transition-all"
                        style={{ width: `${Math.min((cartState.subtotal / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-dark mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
