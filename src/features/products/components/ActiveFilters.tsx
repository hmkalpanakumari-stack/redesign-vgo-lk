import type { ProductFilters } from '@/types/product'
import { formatPrice } from '@/utils/formatters'

interface ActiveFiltersProps {
  filters: ProductFilters
  onClearFilter: (key: keyof ProductFilters) => void
  onClearAll: () => void
  className?: string
}

export function ActiveFilters({
  filters,
  onClearFilter,
  onClearAll,
  className = '',
}: ActiveFiltersProps) {
  const filterTags: { key: keyof ProductFilters; label: string }[] = []

  if (filters.categories?.length) {
    filters.categories.forEach(cat => {
      filterTags.push({ key: 'categories', label: `Category: ${cat}` })
    })
  }

  if (filters.brands?.length) {
    filters.brands.forEach(brand => {
      filterTags.push({ key: 'brands', label: `Brand: ${brand}` })
    })
  }

  if (filters.priceRange) {
    const maxLabel = filters.priceRange.max === Infinity ? '+' : ` - ${formatPrice(filters.priceRange.max)}`
    filterTags.push({
      key: 'priceRange',
      label: `Price: ${formatPrice(filters.priceRange.min)}${maxLabel}`,
    })
  }

  if (filters.colors?.length) {
    filters.colors.forEach(color => {
      filterTags.push({ key: 'colors', label: `Color: ${color}` })
    })
  }

  if (filters.ratings?.length) {
    filterTags.push({ key: 'ratings', label: `Rating: ${Math.min(...filters.ratings)}+ stars` })
  }

  if (filters.inStock) {
    filterTags.push({ key: 'inStock', label: 'In Stock' })
  }

  if (filters.onSale) {
    filterTags.push({ key: 'onSale', label: 'On Sale' })
  }

  if (filterTags.length === 0) return null

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-dark-muted">Active Filters:</span>
      {filterTags.map((tag, index) => (
        <button
          key={`${tag.key}-${index}`}
          onClick={() => onClearFilter(tag.key)}
          className="inline-flex items-center gap-1 px-2 py-1 bg-primary-orange/10 text-primary-orange text-sm rounded-full hover:bg-primary-orange/20 transition-colors"
        >
          {tag.label}
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-sm text-dark-muted hover:text-error transition-colors"
      >
        Clear All
      </button>
    </div>
  )
}
