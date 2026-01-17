import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useUI } from '@/context/UIContext'
import { formatPrice } from '@/utils/formatters'
import { CartItemList } from '@/components/common/CartItem'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const { state: cartState, itemCount } = useCart()
  const { state: uiState, setCartDrawer } = useUI()

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && uiState.isCartDrawerOpen) {
        setCartDrawer(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [uiState.isCartDrawerOpen, setCartDrawer])

  // Prevent body scroll when open
  useEffect(() => {
    if (uiState.isCartDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [uiState.isCartDrawerOpen])

  if (!uiState.isCartDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={() => setCartDrawer(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-light-border">
          <h2 className="text-lg font-semibold text-dark">
            Shopping Cart ({itemCount})
          </h2>
          <button
            onClick={() => setCartDrawer(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4">
          {cartState.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <svg
                className="w-20 h-20 text-dark-muted mb-4"
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
              <h3 className="text-lg font-medium text-dark mb-2">Your cart is empty</h3>
              <p className="text-dark-muted mb-4">Looks like you haven't added anything yet</p>
              <Button onClick={() => setCartDrawer(false)}>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <CartItemList items={cartState.items} variant="default" />
          )}
        </div>

        {/* Footer */}
        {cartState.items.length > 0 && (
          <div className="border-t border-light-border p-4 space-y-4">
            {/* Summary */}
            <div className="space-y-2">
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
                  {cartState.shipping === 0 ? 'Free' : formatPrice(cartState.shipping)}
                </span>
              </div>
              <div className="pt-2 border-t border-light-border">
                <div className="flex justify-between">
                  <span className="font-semibold text-dark">Total</span>
                  <span className="text-xl font-bold text-primary-orange">
                    {formatPrice(cartState.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link to="/checkout" onClick={() => setCartDrawer(false)}>
                <Button variant="primary" fullWidth>
                  Checkout
                </Button>
              </Link>
              <Link to="/cart" onClick={() => setCartDrawer(false)}>
                <Button variant="outline" fullWidth>
                  View Cart
                </Button>
              </Link>
            </div>

            {/* Free Shipping Notice */}
            {cartState.subtotal < 5000 && (
              <p className="text-xs text-center text-dark-muted">
                Add {formatPrice(5000 - cartState.subtotal)} more for free shipping!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
