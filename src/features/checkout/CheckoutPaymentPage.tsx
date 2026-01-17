import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useCheckout } from './CheckoutPage'
import { paymentMethods } from '@/data/orders'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Checkbox } from '@/components/ui/Checkbox'
import type { PaymentMethod } from '@/types/order'

export function CheckoutPaymentPage() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { setPaymentMethod, state: checkoutState } = useCheckout()

  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    checkoutState.paymentMethod?.id || paymentMethods[0].id
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Card details (for card payment)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId)

  const handlePlaceOrder = async () => {
    if (!acceptTerms) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    const method = paymentMethods.find(m => m.id === selectedMethodId)
    if (method) {
      setPaymentMethod(method)
    }

    // Generate order ID
    const orderId = `VGO-${Date.now()}`

    // Clear cart
    clearCart()

    // Navigate to confirmation
    navigate(`/order-confirmation/${orderId}`)

    setIsProcessing(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold text-dark mb-6">Payment Method</h2>

      {/* Payment Methods */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map(method => (
          <label
            key={method.id}
            className={`
              flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors
              ${!method.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
              ${selectedMethodId === method.id && method.isAvailable
                ? 'border-primary-orange bg-primary-orange/5'
                : 'border-light-border hover:border-dark-muted'
              }
            `}
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={selectedMethodId === method.id}
              onChange={() => setSelectedMethodId(method.id)}
              disabled={!method.isAvailable}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{method.icon}</span>
                <span className="font-medium text-dark">{method.name}</span>
                {!method.isAvailable && (
                  <span className="text-xs text-error">Not available</span>
                )}
              </div>
              {method.description && (
                <p className="text-sm text-dark-muted mt-1">{method.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Card Details Form */}
      {selectedMethod?.type === 'card' && (
        <div className="border border-light-border rounded-lg p-4 mb-6">
          <h3 className="font-medium text-dark mb-4">Card Details</h3>
          <div className="space-y-4">
            <Input
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
            />
            <Input
              label="Name on Card"
              placeholder="JOHN DOE"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
              <Input
                label="CVV"
                placeholder="123"
                type="password"
                value={cardCvv}
                onChange={(e) => setCardCvv(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* COD Notice */}
      {selectedMethod?.type === 'cod' && (
        <div className="border border-warning/50 bg-warning/10 rounded-lg p-4 mb-6">
          <p className="text-sm text-dark-secondary">
            <strong>Cash on Delivery:</strong> Please have the exact amount ready when your order arrives.
            Our delivery partner will collect the payment at your doorstep.
          </p>
        </div>
      )}

      {/* Bank Transfer Notice */}
      {selectedMethod?.type === 'bank' && (
        <div className="border border-light-border rounded-lg p-4 mb-6">
          <h4 className="font-medium text-dark mb-2">Bank Transfer Details</h4>
          <div className="text-sm text-dark-secondary space-y-1">
            <p><strong>Bank:</strong> Commercial Bank of Ceylon</p>
            <p><strong>Account Name:</strong> VGO.lk (Pvt) Ltd</p>
            <p><strong>Account Number:</strong> 1234567890</p>
            <p><strong>Branch:</strong> Colombo Main</p>
            <p className="mt-2 text-warning">
              Please transfer the exact amount and send the receipt to orders@vgo.lk
            </p>
          </div>
        </div>
      )}

      {/* Terms */}
      <div className="mb-6">
        <Checkbox
          label="I agree to the Terms of Service and Privacy Policy"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />
      </div>

      {/* Place Order Button */}
      <div className="flex gap-4">
        <Button variant="ghost" onClick={() => navigate('/checkout/shipping')}>
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handlePlaceOrder}
          disabled={!acceptTerms || isProcessing}
          isLoading={isProcessing}
          className="flex-1"
          size="lg"
        >
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Button>
      </div>

      {/* Security Note */}
      <p className="text-xs text-center text-dark-muted mt-4">
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your payment information is secure and encrypted
      </p>
    </div>
  )
}
