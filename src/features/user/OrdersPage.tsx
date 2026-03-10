import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { orderService } from '@/services'
import { formatPrice } from '@/utils/formatters'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Order, OrderStatus } from '@/types/order'

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-light-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-dark text-lg">{order.orderNumber}</h2>
            <p className="text-sm text-dark-muted">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Items */}
          <div>
            <h3 className="font-semibold text-dark mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex gap-3">
                  {item.productImageUrl && (
                    <img src={item.productImageUrl} alt={item.productName} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark text-sm">{item.productName}</p>
                    {item.variantName && <p className="text-xs text-dark-muted">{item.variantName}</p>}
                    <p className="text-xs text-dark-secondary">Qty: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                  </div>
                  <p className="font-medium text-dark text-sm flex-shrink-0">{formatPrice(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-light-border pt-4">
            <h3 className="font-semibold text-dark mb-3">Order Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-dark-secondary">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-dark-secondary">
                <span>Shipping</span><span>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              {order.tax > 0 && (
                <div className="flex justify-between text-dark-secondary">
                  <span>Tax</span><span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-dark border-t border-light-border pt-2 mt-2">
                <span>Total</span><span className="text-primary-orange">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment */}
          <div className="grid grid-cols-2 gap-4 border-t border-light-border pt-4">
            <div>
              <h3 className="font-semibold text-dark mb-2 text-sm">Shipping Address</h3>
              <p className="text-sm text-dark">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p className="text-sm text-dark-secondary">{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p className="text-sm text-dark-secondary">{order.shippingAddress.addressLine2}</p>
              )}
              <p className="text-sm text-dark-secondary">{order.shippingAddress.city}, {order.shippingAddress.district}</p>
              <p className="text-sm text-dark-secondary">{order.shippingAddress.phone}</p>
            </div>
            <div>
              <h3 className="font-semibold text-dark mb-2 text-sm">Delivery</h3>
              <p className="text-sm text-dark">{order.shippingMethod.name}</p>
              <p className="text-sm text-dark-secondary">{order.shippingMethod.estimatedDays}</p>
              {order.estimatedDelivery && (
                <p className="text-sm text-dark-secondary mt-1">
                  Est. {new Date(order.estimatedDelivery).toLocaleDateString()}
                </p>
              )}
              {order.trackingNumber && (
                <p className="text-sm text-dark-secondary mt-1">
                  Tracking: <span className="font-medium">{order.trackingNumber}</span>
                </p>
              )}
              <h3 className="font-semibold text-dark mb-1 mt-3 text-sm">Payment</h3>
              <p className="text-sm text-dark">{order.paymentMethod.name}</p>
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="border-t border-light-border pt-4">
              <h3 className="font-semibold text-dark mb-3 text-sm">Order Timeline</h3>
              <div className="space-y-2">
                {[...order.statusHistory].reverse().map((h, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary-orange mt-1.5 flex-shrink-0" />
                      {i < order.statusHistory.length - 1 && <div className="w-px flex-1 bg-light-border mt-1" />}
                    </div>
                    <div className="pb-2">
                      <p className="font-medium text-dark capitalize">{h.status.replace('_', ' ')}</p>
                      {h.note && <p className="text-dark-muted text-xs">{h.note}</p>}
                      <p className="text-dark-muted text-xs">{new Date(h.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function OrdersPage() {
  const { state } = useAuth()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!state.isAuthenticated) {
        setLoading(false)
        return
      }
      setLoading(true)
      setError(null)
      try {
        const status = filter === 'all' ? undefined : filter
        const response = await orderService.getOrders(1, 50, status)
        setOrders(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [state.isAuthenticated, filter])

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId)
    setCancelError(null)
    setConfirmCancelId(null)
    try {
      await orderService.cancelOrder(orderId)
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus } : o))
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: 'cancelled' as OrderStatus } : null)
      }
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : 'Failed to cancel order')
    } finally {
      setCancellingId(null)
    }
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/account/orders' },
  ]

  const statusFilters: Array<{ label: string; value: OrderStatus | 'all' }> = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ]

  const getStatusColor = (status: OrderStatus) => {
    const colors: Record<OrderStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      out_for_delivery: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-orange-100 text-orange-800',
      refunded: 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <h1 className="text-2xl font-bold text-dark mb-6">My Orders</h1>

        {/* Status Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {statusFilters.map((statusFilter) => (
            <Button
              key={statusFilter.value}
              variant={filter === statusFilter.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setFilter(statusFilter.value)}
            >
              {statusFilter.label}
            </Button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-semibold text-dark mb-2">No orders found</h2>
            <p className="text-dark-muted mb-6">
              {filter === 'all'
                ? "You haven't placed any orders yet."
                : `No ${filter} orders found.`}
            </p>
            <Link to="/products">
              <Button>Start Shopping</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-dark mb-1">{order.orderNumber}</p>
                    <p className="text-sm text-dark-muted">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm text-dark-secondary mt-1">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg text-primary-orange mb-1">
                      {formatPrice(order.total)}
                    </p>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-light-border pt-4 mb-4">
                  <div className="flex gap-3 flex-wrap">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        {item.productImageUrl && (
                          <img
                            src={item.productImageUrl}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-dark text-sm">{item.productName}</p>
                          {item.variantName && (
                            <p className="text-xs text-dark-muted">{item.variantName}</p>
                          )}
                          <p className="text-sm text-dark-secondary">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="border-t border-light-border pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-dark-muted mb-1">Shipping Address</p>
                      <p className="text-dark font-medium">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                      </p>
                      <p className="text-dark-secondary">
                        {order.shippingAddress.addressLine1}, {order.shippingAddress.city}
                      </p>
                    </div>
                    <div>
                      <p className="text-dark-muted mb-1">Payment Method</p>
                      <p className="text-dark font-medium">{order.paymentMethod.name}</p>
                      {order.estimatedDelivery && (
                        <p className="text-dark-secondary mt-2">
                          Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cancel error */}
                {cancelError && confirmCancelId === order.id && (
                  <p className="text-red-500 text-sm mt-3">{cancelError}</p>
                )}

                {/* Actions */}
                <div className="border-t border-light-border pt-4 mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </Button>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">Reorder</Button>
                  )}
                  {['pending', 'confirmed'].includes(order.status) && (
                    confirmCancelId === order.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-dark-muted">Cancel this order?</span>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {cancellingId === order.id ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          onClick={() => { setConfirmCancelId(null); setCancelError(null) }}
                          disabled={cancellingId === order.id}
                          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-light-border text-dark-secondary hover:bg-gray-50 disabled:opacity-50"
                        >
                          Keep Order
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setConfirmCancelId(order.id); setCancelError(null) }}
                        className="px-3 py-1.5 text-sm font-medium rounded-lg border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Cancel Order
                      </button>
                    )
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}
