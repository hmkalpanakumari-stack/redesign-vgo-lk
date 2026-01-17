import { Link } from 'react-router-dom'
import type { CartItem as CartItemType } from '@/types/order'
import { formatPrice } from '@/utils/formatters'
import { QuantitySelector } from './QuantitySelector'
import { useCart } from '@/context/CartContext'

interface CartItemProps {
  item: CartItemType
  variant?: 'default' | 'compact'
  showRemove?: boolean
  showQuantityControls?: boolean
  className?: string
}

export function CartItem({
  item,
  variant = 'default',
  showRemove = true,
  showQuantityControls = true,
  className = '',
}: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const primaryImage = item.product.images.find(img => img.isPrimary) || item.product.images[0]
  const unitPrice = item.variant?.priceModifier
    ? item.product.price.amount + item.variant.priceModifier
    : item.product.price.amount
  const totalPrice = unitPrice * item.quantity

  if (variant === 'compact') {
    return (
      <div className={`flex gap-3 ${className}`}>
        <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
          <img
            src={primaryImage?.url}
            alt={item.product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/product/${item.product.slug}`}
            className="text-sm font-medium text-dark line-clamp-1 hover:text-primary-orange"
          >
            {item.product.name}
          </Link>
          {item.variant && (
            <p className="text-xs text-dark-muted mt-0.5">{item.variant.name}</p>
          )}
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-dark-muted">Qty: {item.quantity}</span>
            <span className="text-sm font-semibold text-primary-orange">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-4 py-4 border-b border-light-border ${className}`}>
      {/* Product Image */}
      <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
        <img
          src={primaryImage?.url}
          alt={item.product.name}
          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <Link
              to={`/product/${item.product.slug}`}
              className="font-medium text-dark hover:text-primary-orange line-clamp-2"
            >
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="text-sm text-dark-muted mt-1">
                {item.variant.type === 'color' && (
                  <span className="flex items-center gap-1">
                    <span
                      className="w-4 h-4 rounded-full border border-light-border"
                      style={{ backgroundColor: item.variant.colorCode }}
                    />
                    {item.variant.name}
                  </span>
                )}
                {item.variant.type !== 'color' && item.variant.name}
              </p>
            )}
            <p className="text-sm text-dark-muted mt-1">
              Unit price: {formatPrice(unitPrice)}
            </p>
          </div>

          {showRemove && (
            <button
              onClick={() => removeItem(item.id)}
              className="p-2 text-dark-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors h-fit"
              aria-label="Remove item"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-4">
          {showQuantityControls ? (
            <QuantitySelector
              value={item.quantity}
              onChange={(qty) => updateQuantity(item.id, qty)}
              max={item.product.stock}
              size="sm"
            />
          ) : (
            <span className="text-sm text-dark-muted">Qty: {item.quantity}</span>
          )}

          <span className="text-lg font-bold text-primary-orange">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* Stock Warning */}
        {item.product.stock <= 5 && item.product.stock > 0 && (
          <p className="text-xs text-warning mt-2">
            Only {item.product.stock} left in stock
          </p>
        )}
      </div>
    </div>
  )
}

interface CartItemListProps {
  items: CartItemType[]
  variant?: 'default' | 'compact'
  className?: string
}

export function CartItemList({ items, variant = 'default', className = '' }: CartItemListProps) {
  if (items.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <svg
          className="w-16 h-16 mx-auto text-dark-muted mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <p className="text-dark-muted">Your cart is empty</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {items.map(item => (
        <CartItem key={item.id} item={item} variant={variant} />
      ))}
    </div>
  )
}
