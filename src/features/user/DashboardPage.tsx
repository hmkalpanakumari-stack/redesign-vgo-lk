import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { getUserOrders } from '@/data/orders'
import { formatPrice } from '@/utils/formatters'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function DashboardPage() {
  const { state } = useAuth()
  const recentOrders = state.user ? getUserOrders(state.user.id).slice(0, 3) : []

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
  ]

  const stats = [
    { label: 'Total Orders', value: recentOrders.length, icon: '📦' },
    { label: 'Wishlist Items', value: '0', icon: '❤️' },
    { label: 'Saved Addresses', value: '0', icon: '📍' },
    { label: 'Notifications', value: '0', icon: '🔔' },
  ]

  const quickLinks = [
    { label: 'My Orders', href: '/account/orders', icon: '📋' },
    { label: 'Wishlist', href: '/account/wishlist', icon: '❤️' },
    { label: 'Profile Settings', href: '/account/profile', icon: '👤' },
    { label: 'Addresses', href: '/account/addresses', icon: '📍' },
    { label: 'Notifications', href: '/account/notifications', icon: '🔔' },
  ]

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark mb-2">My Account</h1>
          {state.user && (
            <p className="text-dark-secondary">
              Welcome back, {state.user.firstName} {state.user.lastName}!
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-dark mb-1">{stat.value}</div>
              <div className="text-sm text-dark-muted">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-dark mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} to={link.href}>
                <Card className="p-4 hover:shadow-lg transition-shadow text-center">
                  <div className="text-3xl mb-2">{link.icon}</div>
                  <div className="text-sm font-medium text-dark">{link.label}</div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-dark">Recent Orders</h2>
              <Link to="/account/orders">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-semibold text-dark">{order.orderNumber}</p>
                      <p className="text-sm text-dark-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary-orange">
                        {formatPrice(order.total)}
                      </p>
                      <span className="text-sm px-3 py-1 bg-primary-orange/10 text-primary-orange rounded-full">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.items.slice(0, 3).map((item) => (
                      <img
                        key={item.id}
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-16 h-16 bg-light-bg-alt rounded flex items-center justify-center text-sm text-dark-muted">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
