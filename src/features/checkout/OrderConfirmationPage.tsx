import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function OrderConfirmationPage() {
  const { orderId } = useParams()

  return (
    <div className="bg-light-bg min-h-screen py-12">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-xl shadow-card p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-success"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-dark mb-2">Order Confirmed!</h1>
          <p className="text-dark-muted mb-6">
            Thank you for your order. We've received your order and will begin processing it soon.
          </p>

          {/* Order Number */}
          <div className="bg-light-bg rounded-lg p-4 mb-6">
            <p className="text-sm text-dark-muted">Order Number</p>
            <p className="text-xl font-bold text-dark">{orderId}</p>
          </div>

          {/* What's Next */}
          <div className="text-left mb-8">
            <h2 className="font-semibold text-dark mb-4">What happens next?</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-orange font-semibold text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-dark">Order Processing</p>
                  <p className="text-sm text-dark-muted">
                    We're preparing your order for shipment
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-orange font-semibold text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-dark">Confirmation Email</p>
                  <p className="text-sm text-dark-muted">
                    You'll receive an email with order details and tracking info
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-primary-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-orange font-semibold text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-dark">Delivery</p>
                  <p className="text-sm text-dark-muted">
                    Your order will be delivered to your specified address
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/account/orders" className="flex-1">
              <Button variant="outline" fullWidth>
                View Order Details
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button variant="primary" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Support */}
          <p className="text-sm text-dark-muted mt-6">
            Questions about your order?{' '}
            <a href="/contact" className="text-primary-orange hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
