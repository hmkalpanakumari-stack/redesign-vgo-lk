import { ReactNode } from 'react'

type BadgeVariant = 'default' | 'sale' | 'new' | 'hot' | 'success' | 'warning' | 'error' | 'info'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-dark-secondary',
  sale: 'bg-error text-white',
  new: 'bg-success text-white',
  hot: 'bg-primary-orange text-white',
  success: 'bg-success text-white',
  warning: 'bg-warning text-dark',
  error: 'bg-error text-white',
  info: 'bg-info text-white',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

interface DiscountBadgeProps {
  percentage: number
  className?: string
}

export function DiscountBadge({ percentage, className = '' }: DiscountBadgeProps) {
  return (
    <Badge variant="sale" className={className}>
      -{percentage}%
    </Badge>
  )
}

interface StockBadgeProps {
  stock: number
  className?: string
}

export function StockBadge({ stock, className = '' }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <Badge variant="error" className={className}>
        Out of Stock
      </Badge>
    )
  }

  if (stock <= 5) {
    return (
      <Badge variant="warning" className={className}>
        Only {stock} left
      </Badge>
    )
  }

  return (
    <Badge variant="success" className={className}>
      In Stock
    </Badge>
  )
}
