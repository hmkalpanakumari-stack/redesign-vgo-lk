import { useState, useEffect } from 'react'
import { categoryService } from '@/services'
import { categories as staticCategories } from '@/data/categories'
import type { Category, ProductFilters, PriceRange } from '@/types/product'
import { Checkbox } from '@/components/ui/Checkbox'
import { Button } from '@/components/ui/Button'
import { AccordionRoot, AccordionItemRoot, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion'
import { Rating } from '@/components/ui/Rating'

interface FilterSidebarProps {
  filters: ProductFilters
  activeCategorySlug?: string
  onToggleCategory: (categoryId: string) => void
  onToggleBrand: (brand: string) => void
  onToggleColor?: (color: string) => void
  onToggleRating: (rating: number) => void
  onSetPriceRange: (range: PriceRange) => void
  onSetInStock: (inStock: boolean) => void
  onSetOnSale: (onSale: boolean) => void
  onClearFilters: () => void
}

const priceRanges = [
  { min: 0, max: 5000, label: 'Under Rs. 5,000' },
  { min: 5000, max: 25000, label: 'Rs. 5,000 – Rs. 25,000' },
  { min: 25000, max: 100000, label: 'Rs. 25,000 – Rs. 100,000' },
  { min: 100000, max: 300000, label: 'Rs. 100,000 – Rs. 300,000' },
  { min: 300000, max: 600000, label: 'Rs. 300,000 – Rs. 600,000' },
  { min: 600000, max: Infinity, label: 'Above Rs. 600,000' },
]

// Brands from seeded data — matches API brands exactly
const KNOWN_BRANDS = [
  'Apple', 'Samsung', 'Sony', 'Dell', 'Google', 'Bose', 'Nike', 'Adidas',
  'Ray-Ban', "Levi's", 'Tommy Hilfiger', 'Michael Kors', 'Casio', 'H&M',
  'Zara', 'Fossil', 'Converse', 'Under Armour', 'Dyson', 'Instant Pot',
  'KitchenAid', 'Philips', 'IKEA', 'Nespresso', 'iRobot', 'LG', 'Ninja',
  'Garmin', 'YETI', 'Peloton', 'The North Face', 'Fitbit', 'Coleman',
  'Manduka', 'Hydro Flask', 'FOREO', 'The Ordinary', 'Oral-B', 'Therabody',
  'CeraVe', 'NuFACE', 'LEGO', 'DJI', 'Hasbro', 'Hot Wheels',
]

export function FilterSidebar({
  filters,
  activeCategorySlug,
  onToggleCategory,
  onToggleBrand,
  onToggleRating,
  onSetPriceRange,
  onSetInStock,
  onSetOnSale,
  onClearFilters,
}: FilterSidebarProps) {
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [categories, setCategories] = useState<Category[]>(staticCategories)

  useEffect(() => {
    categoryService.getCategories()
      .then(setCategories)
      .catch(() => setCategories(staticCategories))
  }, [])

  const handleCustomPriceRange = () => {
    const min = priceMin ? parseInt(priceMin) : 0
    const max = priceMax ? parseInt(priceMax) : Infinity
    if (min >= 0 && (max === Infinity || max > min)) {
      onSetPriceRange({ min, max })
    }
  }

  const handleClearAll = () => {
    setPriceMin('')
    setPriceMax('')
    onClearFilters()
  }

  // Find which main category is active or contains the active subcategory
  const activeCat = categories.find(
    c => c.slug === activeCategorySlug || c.children?.some(ch => ch.slug === activeCategorySlug)
  )

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-dark">Filters</h2>
        <button
          onClick={handleClearAll}
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
              {categories.map(category => {
                const isActive = category.slug === activeCategorySlug
                const hasActiveChild = category.children?.some(c => c.slug === activeCategorySlug)
                const isExpanded = isActive || !!hasActiveChild

                return (
                  <div key={category.id || category.slug}>
                    <Checkbox
                      label={category.name}
                      checked={isActive || !!hasActiveChild}
                      onChange={() => onToggleCategory(category.slug)}
                    />
                    {category.children && isExpanded && (
                      <div className="ml-6 mt-2 space-y-2">
                        {category.children.map(child => (
                          <Checkbox
                            key={child.id || child.slug}
                            label={child.name}
                            checked={child.slug === activeCategorySlug}
                            onChange={() => onToggleCategory(child.slug)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItemRoot>

        {/* Price Range */}
        <AccordionItemRoot id="price">
          <AccordionTrigger id="price">Price Range</AccordionTrigger>
          <AccordionContent id="price">
            <div className="space-y-2">
              {priceRanges.map((range, index) => {
                const isSelected =
                  filters.priceRange?.min === range.min &&
                  filters.priceRange?.max === range.max
                return (
                  <button
                    key={index}
                    onClick={() => onSetPriceRange({ min: range.min, max: range.max })}
                    className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                      isSelected
                        ? 'bg-primary-orange/10 text-primary-orange font-medium'
                        : 'text-dark-secondary hover:bg-gray-100'
                    }`}
                  >
                    {range.label}
                  </button>
                )
              })}
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
              {KNOWN_BRANDS.map(brand => (
                <Checkbox
                  key={brand}
                  label={brand}
                  checked={filters.brands?.includes(brand) ?? false}
                  onChange={() => onToggleBrand(brand)}
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

      {/* Active category hint */}
      {activeCat && (
        <p className="mt-3 text-xs text-dark-muted text-center">
          Browsing: <span className="font-medium text-primary-orange">{activeCat.name}</span>
        </p>
      )}
    </div>
  )
}
