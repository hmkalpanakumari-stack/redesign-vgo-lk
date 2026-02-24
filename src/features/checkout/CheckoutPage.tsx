import { useState, createContext, useContext } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/formatters'
import { getImageUrl } from '@/services/apiClient'
import type { Address, ShippingMethod, PaymentMethod, CheckoutState } from '@/types/order'

interface CheckoutContextType {
  state: CheckoutState
  setGuestEmail: (email: string) => void
  setShippingAddress: (address: Address) => void
  setShippingMethod: (method: ShippingMethod) => void
  setPaymentMethod: (method: PaymentMethod) => void
  goToStep: (step: CheckoutState['step']) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export function useCheckout() {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider')
  }
  return context
}

const steps = [
  { id: 'login' as const, label: 'Account', path: '/checkout' },
  { id: 'address' as const, label: 'Address', path: '/checkout/address' },
  { id: 'shipping' as const, label: 'Shipping', path: '/checkout/shipping' },
  { id: 'payment' as const, label: 'Payment', path: '/checkout/payment' },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state: cartState } = useCart()

  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    step: 'login',
    sameAsBilling: true,
  })

  // Determine current step from path
  const currentStep = steps.find(s => s.path === location.pathname)?.id || 'login'
  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const setGuestEmail = (email: string) => {
    setCheckoutState(prev => ({ ...prev, guestEmail: email }))
  }

  const setShippingAddress = (address: Address) => {
    setCheckoutState(prev => ({ ...prev, shippingAddress: address }))
  }

  const setShippingMethod = (method: ShippingMethod) => {
    setCheckoutState(prev => ({ ...prev, shippingMethod: method }))
  }

  const setPaymentMethod = (method: PaymentMethod) => {
    setCheckoutState(prev => ({ ...prev, paymentMethod: method }))
  }

  const goToStep = (step: CheckoutState['step']) => {
    const stepInfo = steps.find(s => s.id === step)
    if (stepInfo) {
      navigate(stepInfo.path)
    }
  }

  // Redirect to cart if empty
  if (cartState.items.length === 0 && location.pathname !== '/checkout') {
    navigate('/cart')
    return null
  }

  return (
    <CheckoutContext.Provider
      value={{
        state: checkoutState,
        setGuestEmail,
        setShippingAddress,
        setShippingMethod,
        setPaymentMethod,
        goToStep,
      }}
    >
      <div className="bg-light-bg min-h-screen">
        <div className="container py-6">
          {/* Progress Steps */}
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {steps.map((step, index) => {
                const isActive = currentStepIndex === index
                const isCompleted = currentStepIndex > index

                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center font-medium
                          ${isActive ? 'bg-primary-orange text-white' : ''}
                          ${isCompleted ? 'bg-success text-white' : ''}
                          ${!isActive && !isCompleted ? 'bg-gray-200 text-dark-muted' : ''}
                        `}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span className={`mt-2 text-sm ${isActive ? 'font-medium text-dark' : 'text-dark-muted'}`}>
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-12 md:w-24 h-0.5 mx-2 ${
                          isCompleted ? 'bg-success' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Outlet />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-dark mb-4">Order Summary</h2>

                {/* Items Preview */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cartState.items.map(item => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={getImageUrl(item.product.images[0]?.url)}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-dark line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-dark-muted">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.product.price.amount * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="my-4 border-light-border" />

                {/* Summary Lines */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-muted">Subtotal</span>
                    <span>{formatPrice(cartState.subtotal)}</span>
                  </div>
                  {checkoutState.shippingMethod && (
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-muted">Shipping</span>
                      <span>
                        {checkoutState.shippingMethod.price === 0
                          ? 'Free'
                          : formatPrice(checkoutState.shippingMethod.price)}
                      </span>
                    </div>
                  )}
                  {cartState.discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Discount</span>
                      <span>-{formatPrice(cartState.discount)}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-light-border">
                  <div className="flex justify-between">
                    <span className="font-semibold text-dark">Total</span>
                    <span className="text-xl font-bold text-primary-orange">
                      {formatPrice(
                        cartState.total +
                        (checkoutState.shippingMethod?.price || 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckoutContext.Provider>
  )
}
