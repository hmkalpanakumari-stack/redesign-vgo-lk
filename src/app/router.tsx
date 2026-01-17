import { Routes, Route } from 'react-router-dom'
import { PageLayout } from '@/components/layout/PageLayout'
import { HomePage } from '@/features/home/HomePage'
import { ProductListPage } from '@/features/products/ProductListPage'
import { ProductDetailPage } from '@/features/products/ProductDetailPage'
import { CartPage } from '@/features/cart/CartPage'
import { CheckoutPage } from '@/features/checkout/CheckoutPage'
import { CheckoutLoginPage } from '@/features/checkout/CheckoutLoginPage'
import { CheckoutAddressPage } from '@/features/checkout/CheckoutAddressPage'
import { CheckoutShippingPage } from '@/features/checkout/CheckoutShippingPage'
import { CheckoutPaymentPage } from '@/features/checkout/CheckoutPaymentPage'
import { OrderConfirmationPage } from '@/features/checkout/OrderConfirmationPage'
import { DashboardPage } from '@/features/user/DashboardPage'
import { OrdersPage } from '@/features/user/OrdersPage'
import { WishlistPage } from '@/features/user/WishlistPage'
import { ProfilePage } from '@/features/user/ProfilePage'
import { AddressesPage } from '@/features/user/AddressesPage'
import { NotificationsPage } from '@/features/user/NotificationsPage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/:category" element={<ProductListPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />

        {/* Checkout Flow */}
        <Route path="checkout" element={<CheckoutPage />}>
          <Route index element={<CheckoutLoginPage />} />
          <Route path="address" element={<CheckoutAddressPage />} />
          <Route path="shipping" element={<CheckoutShippingPage />} />
          <Route path="payment" element={<CheckoutPaymentPage />} />
        </Route>
        <Route path="order-confirmation/:orderId" element={<OrderConfirmationPage />} />

        {/* User Dashboard */}
        <Route path="account" element={<DashboardPage />} />
        <Route path="account/orders" element={<OrdersPage />} />
        <Route path="account/wishlist" element={<WishlistPage />} />
        <Route path="account/profile" element={<ProfilePage />} />
        <Route path="account/addresses" element={<AddressesPage />} />
        <Route path="account/notifications" element={<NotificationsPage />} />
      </Route>
    </Routes>
  )
}
