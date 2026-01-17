import { useState } from 'react'
import { categories } from '@/data/categories'
import { products } from '@/data/products'
import type { ProductFilters, PriceRange } from '@/types/product'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { AccordionRoot, AccordionItemRoot, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'
import { Rating } from '@/components/ui/Rating'

interface FilterSidebarProps {
  filters: ProductFilters
  onToggleCategory: (categoryId: string) => void
  onToggleBrand: (brand: string) => void
  onToggleColor: (color: string) => void
  onToggleRating: (rating: number) => void
  onSetPriceRange: (range: PriceRange) => void
  onSetInStock: (inStock: boolean) => void
  onSetOnSale: (onSale: boolean) => void
  onClearFilters: () => void
}

// Extract unique brands from products
const brands = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[]

// Extract unique colors from product variants
const colors = [...new Set(
  products
    .flatMap(p => p.variants || [])
    .filter(v => v.type === 'color')
    .map(v => ({ name: v.name, value: v.value, colorCode: v.colorCode }))
    .map(c => JSON.stringify(c))
)].map(c => JSON.parse(c))

// Price range
const priceRanges = [
  { min: 0, max: 1000, label: 'Under Rs. 1,000' },
  { min: 1000, max: 5000, label: 'Rs. 1,000 - Rs. 5,000' },
  { min: 5000, max: 10000, label: 'Rs. 5,000 - Rs. 10,000' },
  { min: 10000, max: 50000, label: 'Rs. 10,000 - Rs. 50,000' },
  { min: 50000, max: 100000, label: 'Rs. 50,000 - Rs. 100,000' },
  { min: 100000, max: Infinity, label: 'Above Rs. 100,000' },
]

export function FilterSidebar({
  filters,
  onToggleCategory,
  onToggleBrand,
  onToggleColor,
  onToggleRating,
  onSetPriceRange,
  onSetInStock,
  onSetOnSale,
  onClearFilters,
}: FilterSidebarProps) {
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const handleCustomPriceRange = () => {
    const min = priceMin ? parseInt(priceMin) : 0
    const max = priceMax ? parseInt(priceMax) : Infinity
    if (min >= 0 && max > min) {
      onSetPriceRange({ min, max })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-dark">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-orange hover:underline"
        >
          Clear All
        </button>
      </div>

      <AccordionRoot allowMultiple defaultOpenIds={['categories', 'price', 'brands']}>
        {/* Categories */}
        <AccordionItemRoot id="categories">
          <AccordionTrigger id="categories">Categories</AccordionTrigger>
          <AccordionContent id="categories">
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id}>
                  <Checkbox
                    label={category.name}
                    checked={filters.categories?.includes(category.slug)}
                    onChange={() => onToggleCategory(category.slug)}
                  />
                  {category.children && filters.categories?.includes(category.slug) && (
                    <div className="ml-6 mt-2 space-y-2">
                      {category.children.map(child => (
                        <Checkbox
                          key={child.id}
                          label={child.name}
                          checked={filters.categories?.includes(child.slug)}
                          onChange={() => onToggleCategory(child.slug)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItemRoot>

        {/* Price Range */}
        <AccordionItemRoot id="price">
          <AccordionTrigger id="price">Price Range</AccordionTrigger>
          <AccordionContent id="price">
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => onSetPriceRange({ min: range.min, max: range.max })}
                  className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                    filters.priceRange?.min === range.min && filters.priceRange?.max === range.max
                      ? 'bg-primary-orange/10 text-primary-orange font-medium'
                      : 'text-dark-secondary hover:bg-gray-100'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Custom Range */}
            <div className="mt-4 pt-4 border-t border-light-border">
              <p className="text-sm text-dark-muted mb-2">Custom Range</p>
              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="w-full px-2 py-1.5 border border-light-border rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full px-2 py-1.5 border border-light-border rounded text-sm"
                />
              </div>
              <Button size="sm" fullWidth onClick={handleCustomPriceRange}>
                Apply
              </Button>
            </div>
          </AccordionContent>
        </AccordionItemRoot>

        {/* Brands */}
        <AccordionItemRoot id="brands">
          <AccordionTrigger id="brands">Brands</AccordionTrigger>
          <AccordionContent id="brands">
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map(brand => (
                <Checkbox
                  key={brand}
                  label={brand}
                  checked={filters.brands?.includes(brand)}
                  onChange={() => onToggleBrand(brand)}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItemRoot>

        {/* Colors */}
        <AccordionItemRoot id="colors">
          <AccordionTrigger id="colors">Colors</AccordionTrigger>
          <AccordionContent id="colors">
            <div className="flex flex-wrap gap-2">
              {colors.slice(0, 12).map((color, index) => (
                <button
                  key={index}
                  onClick={() => onToggleColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                    filters.colors?.includes(color.value)
                      ? 'border-primary-orange ring-2 ring-primary-orange ring-offset-2'
                      : 'border-light-border'
                  }`}
                  style={{ backgroundColor: color.colorCode }}
                  title={color.name}
                  aria-label={color.name}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItemRoot>

        {/* Rating */}
        <AccordionItemRoot id="rating">
          <AccordionTrigger id="rating">Customer Rating</AccordionTrigger>
          <AccordionContent id="rating">
            <div className="space-y-2">
              {[4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => onToggleRating(rating)}
                  className={`flex items-center gap-2 w-full py-1.5 px-2 rounded transition-colors ${
                    filters.ratings?.includes(rating)
                      ? 'bg-primary-orange/10'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Rating value={rating} size="sm" />
                  <span className="text-sm text-dark-muted">& Up</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItemRoot>

        {/* Availability */}
        <AccordionItemRoot id="availability">
          <AccordionTrigger id="availability">Availability</AccordionTrigger>
          <AccordionContent id="availability">
            <div className="space-y-2">
              <Checkbox
                label="In Stock"
                checked={filters.inStock || false}
                onChange={() => onSetInStock(!filters.inStock)}
              />
              <Checkbox
                label="On Sale"
                checked={filters.onSale || false}
                onChange={() => onSetOnSale(!filters.onSale)}
              />
            </div>
          </AccordionContent>
        </AccordionItemRoot>
      </AccordionRoot>
    </div>
  )
}
