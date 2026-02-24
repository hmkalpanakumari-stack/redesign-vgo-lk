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

export function OrdersPage() {
  const { state } = useAuth()
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!state.isAuthenticated) return
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

  const filteredOrders = orders

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/account/orders' },
  ]

  const statusFilters: Array<{ label: string; value: OrderStatus | 'all' }> = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
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
        ) : filteredOrders.length === 0 ? (
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
            {filteredOrders.map((order) => (
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
                        <img
                          src={item.productImageUrl}
                          alt={item.productName}
                          className="w-20 h-20 object-cover rounded"
                        />
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

                {/* Actions */}
                <div className="border-t border-light-border pt-4 mt-4 flex gap-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  {order.status === 'delivered' && (
                    <Button variant="outline" size="sm">Reorder</Button>
                  )}
                  {['pending', 'confirmed'].includes(order.status) && (
                    <Button variant="outline" size="sm">Cancel Order</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
