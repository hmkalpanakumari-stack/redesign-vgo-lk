import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ToastContainer } from '@/components/ui/Toast'
import { CartDrawer } from './CartDrawer'

export function PageLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Global UI Elements */}
      <ToastContainer />
      <CartDrawer />
    </div>
  )
}
