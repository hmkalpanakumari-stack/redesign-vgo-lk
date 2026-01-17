import { formatPrice } from '@/utils/formatters'
import type { PriceInfo, BulkPrice } from '@/types/product'

interface PriceDisplayProps {
  price: PriceInfo
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showDiscount?: boolean
  className?: string
}

const sizeClasses = {
  sm: {
    current: 'text-base font-semibold',
    original: 'text-sm',
    discount: 'text-xs px-1.5 py-0.5',
  },
  md: {
    current: 'text-lg font-bold',
    original: 'text-sm',
    discount: 'text-xs px-2 py-0.5',
  },
  lg: {
    current: 'text-2xl font-bold',
    original: 'text-base',
    discount: 'text-sm px-2 py-1',
  },
  xl: {
    current: 'text-3xl font-bold',
    original: 'text-lg',
    discount: 'text-sm px-2 py-1',
  },
}

export function PriceDisplay({
  price,
  size = 'md',
  showDiscount = true,
  className = '',
}: PriceDisplayProps) {
  const styles = sizeClasses[size]
  const hasDiscount = price.discountPercentage && price.discountPercentage > 0

  return (
    <div className={`flex items-baseline flex-wrap gap-2 ${className}`}>
      <span className={`${styles.current} text-primary-orange`}>
        {formatPrice(price.amount, price.currency)}
      </span>

      {price.originalAmount && (
        <span className={`${styles.original} text-dark-muted line-through`}>
          {formatPrice(price.originalAmount, price.currency)}
        </span>
      )}

      {showDiscount && hasDiscount && (
        <span className={`${styles.discount} bg-error text-white rounded-full font-medium`}>
          -{price.discountPercentage}%
        </span>
      )}
    </div>
  )
}

interface BulkPriceTableProps {
  prices: BulkPrice[]
  currency?: string
  className?: string
}

export function BulkPriceTable({
  prices,
  currency = 'Rs.',
  className = '',
}: BulkPriceTableProps) {
  return (
    <div className={`border border-light-border rounded-lg overflow-hidden ${className}`}>
      <table className="w-full">
        <thead className="bg-light-bg">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-dark-secondary">
              Quantity
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-dark-secondary">
              Price per unit
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-light-border">
          {prices.map((bulkPrice, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-dark">
                {bulkPrice.maxQuantity
                  ? `${bulkPrice.minQuantity} - ${bulkPrice.maxQuantity}`
                  : `${bulkPrice.minQuantity}+`}
              </td>
              <td className="px-4 py-2 text-sm text-primary-orange font-semibold text-right">
                {formatPrice(bulkPrice.pricePerUnit, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface SavingsDisplayProps {
  originalPrice: number
  currentPrice: number
  currency?: string
  className?: string
}

export function SavingsDisplay({
  originalPrice,
  currentPrice,
  currency = 'Rs.',
  className = '',
}: SavingsDisplayProps) {
  const savings = originalPrice - currentPrice
  const percentage = Math.round((savings / originalPrice) * 100)

  if (savings <= 0) return null

  return (
    <div className={`flex items-center gap-2 text-success ${className}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
      <span className="text-sm font-medium">
        You save {formatPrice(savings, currency)} ({percentage}%)
      </span>
    </div>
  )
}
