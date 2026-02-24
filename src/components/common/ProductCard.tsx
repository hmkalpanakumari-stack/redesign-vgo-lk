import { Link } from 'react-router-dom'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatters'
import { Rating } from '@/components/ui/Rating'
import { Badge, DiscountBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { useUI } from '@/context/UIContext'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'horizontal'
  showAddToCart?: boolean
  className?: string
}

export function ProductCard({
  product,
  variant = 'default',
  showAddToCart = true,
  className = '',
}: ProductCardProps) {
  const { addItem } = useCart()
  const { showToast } = useUI()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, undefined, 1)
    showToast('success', `${product.name} added to cart`)
  }

  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0]
  const hasDiscount = product.price.discountPercentage && product.price.discountPercentage > 0

  if (variant === 'horizontal') {
    return (
      <Link
        to={`/product/${product.slug}`}
        className={`flex gap-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-4 ${className}`}
      >
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <img
            src={primaryImage?.url}
            alt={primaryImage?.altText || product.name}
            className="w-full h-full object-cover rounded-lg"
          />
          {hasDiscount && (
            <DiscountBadge
              percentage={product.price.discountPercentage!}
              className="absolute top-2 left-2"
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-dark line-clamp-2 mb-1">{product.name}</h3>
          <Rating value={product.rating} size="sm" reviewCount={product.reviewCount} />
          <div className="mt-2">
            <span className="text-lg font-bold text-primary-orange">
              {formatPrice(product.price.amount)}
            </span>
            {product.price.originalAmount && (
              <span className="ml-2 text-sm text-dark-muted line-through">
                {formatPrice(product.price.originalAmount)}
              </span>
            )}
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link
        to={`/product/${product.slug}`}
        className={`block bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden ${className}`}
      >
        <div className="relative aspect-product">
          <img
            src={primaryImage?.url}
            alt={primaryImage?.altText || product.name}
            className="w-full h-full object-cover"
          />
          {hasDiscount && (
            <DiscountBadge
              percentage={product.price.discountPercentage!}
              className="absolute top-2 left-2"
            />
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium text-dark line-clamp-2 mb-1">{product.name}</h3>
          <span className="text-base font-bold text-primary-orange">
            {formatPrice(product.price.amount)}
          </span>
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow overflow-hidden group ${className}`}>
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden">
          <img
            src={primaryImage?.url}
            alt={primaryImage?.altText || product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {hasDiscount && (
              <DiscountBadge percentage={product.price.discountPercentage!} />
            )}
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.isBestSeller && <Badge variant="hot">Best Seller</Badge>}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              showToast('info', 'Added to wishlist')
            }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
            aria-label="Add to wishlist"
          >
            <svg className="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-dark-muted mb-1">{product.category.name}</p>

          {/* Name */}
          <h3 className="font-medium text-dark line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <Rating value={product.rating} size="sm" reviewCount={product.reviewCount} className="mb-2" />

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-primary-orange">
              {formatPrice(product.price.amount)}
            </span>
            {product.price.originalAmount && (
              <span className="text-sm text-dark-muted line-through">
                {formatPrice(product.price.originalAmount)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      {showAddToCart && (
        <div className="px-4 pb-4">
          <Button
            variant="primary"
            fullWidth
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      )}
    </div>
  )
}
