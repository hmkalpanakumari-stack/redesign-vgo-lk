import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCheckout } from './CheckoutPage'
import { shippingMethods } from '@/data/orders'
import { formatPrice } from '@/utils/formatters'
import { Button } from '@/components/ui/Button'

export function CheckoutShippingPage() {
  const navigate = useNavigate()
  const { setShippingMethod, state: checkoutState } = useCheckout()

  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    checkoutState.shippingMethod?.id || shippingMethods[0].id
  )

  const handleContinue = () => {
    const method = shippingMethods.find(m => m.id === selectedMethodId)
    if (method) {
      setShippingMethod(method)
      navigate('/checkout/payment')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold text-dark mb-6">Shipping Method</h2>

      {/* Delivery Address Summary */}
      {checkoutState.shippingAddress && (
        <div className="mb-6 p-4 bg-light-bg rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-dark">
                {checkoutState.shippingAddress.firstName} {checkoutState.shippingAddress.lastName}
              </p>
              <p className="text-sm text-dark-muted mt-1">
                {checkoutState.shippingAddress.addressLine1}
                {checkoutState.shippingAddress.addressLine2 && `, ${checkoutState.shippingAddress.addressLine2}`}
              </p>
              <p className="text-sm text-dark-muted">
                {checkoutState.shippingAddress.city}, {checkoutState.shippingAddress.district} {checkoutState.shippingAddress.postalCode}
              </p>
              <p className="text-sm text-dark-muted">{checkoutState.shippingAddress.phone}</p>
            </div>
            <button
              onClick={() => navigate('/checkout/address')}
              className="text-sm text-primary-orange hover:underline"
            >
              Change
            </button>
          </div>
        </div>
      )}

      {/* Shipping Methods */}
      <div className="space-y-3">
        {shippingMethods.map(method => (
          <label
            key={method.id}
            className={`
              flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors
              ${selectedMethodId === method.id
                ? 'border-primary-orange bg-primary-orange/5'
                : 'border-light-border hover:border-dark-muted'
              }
            `}
          >
            <input
              type="radio"
              name="shippingMethod"
              checked={selectedMethodId === method.id}
              onChange={() => setSelectedMethodId(method.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{method.icon}</span>
                  <span className="font-medium text-dark">{method.name}</span>
                </div>
                <span className="font-semibold text-primary-orange">
                  {method.price === 0 ? 'Free' : formatPrice(method.price)}
                </span>
              </div>
              <p className="text-sm text-dark-muted mt-1">{method.description}</p>
              <p className="text-sm text-success mt-1">
                Estimated delivery: {method.estimatedDays}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* Continue Button */}
      <div className="mt-6 flex gap-4">
        <Button variant="ghost" onClick={() => navigate('/checkout/address')}>
          Back
        </Button>
        <Button variant="primary" onClick={handleContinue} className="flex-1">
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
