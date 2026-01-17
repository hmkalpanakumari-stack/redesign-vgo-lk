import { Link } from 'react-router-dom'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export function WishlistPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    { label: 'Wishlist', href: '/account/wishlist' },
  ]

  // Empty wishlist for now
  const wishlistItems: never[] = []

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <p className="text-dark-muted">{wishlistItems.length} items</p>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-semibold text-dark mb-2">Your wishlist is empty</h2>
            <p className="text-dark-muted mb-6">
              Save your favorite products to your wishlist and buy them later!
            </p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Wishlist items will be rendered here */}
          </div>
        )}
      </div>
    </div>
  )
}
