import { useState, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { products, getProductsByCategory, searchProducts } from '@/data/products'
import { getCategoryBySlug } from '@/data/categories'
import { useFilters } from '@/hooks/useFilters'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import { ProductCard } from '@/components/common/ProductCard'
import { FilterSidebar } from './components/FilterSidebar'
import { ActiveFilters } from './components/ActiveFilters'
import type { SortOption } from '@/types/product'

const PRODUCTS_PER_PAGE = 12

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'best-selling', label: 'Best Selling' },
]

export function ProductListPage() {
  const { category: categorySlug } = useParams()
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''
  const saleOnly = searchParams.get('sale') === 'true'
  const newOnly = searchParams.get('new') === 'true'

  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const {
    filters,
    sort,
    setSort,
    toggleCategory,
    toggleBrand,
    toggleColor,
    toggleRating,
    setPriceRange,
    setInStock,
    setOnSale,
    clearFilters,
    clearFilter,
    applyFilters,
    activeFilterCount,
  } = useFilters()

  // Get base products
  const baseProducts = useMemo(() => {
    if (searchQuery) {
      return searchProducts(searchQuery)
    }
    if (categorySlug) {
      return getProductsByCategory(categorySlug)
    }
    let result = products
    if (saleOnly) {
      result = result.filter(p => p.isOnSale)
    }
    if (newOnly) {
      result = result.filter(p => p.isNew)
    }
    return result
  }, [categorySlug, searchQuery, saleOnly, newOnly])

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    return applyFilters(baseProducts)
  }, [baseProducts, applyFilters])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  // Get category info for breadcrumb
  const category = categorySlug ? getCategoryBySlug(categorySlug) : null

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
  ]
  if (category) {
    breadcrumbItems.push({ label: category.name, href: `/products/${category.slug}` })
  }
  if (searchQuery) {
    breadcrumbItems.push({ label: `Search: "${searchQuery}"`, href: `/products?search=${searchQuery}` })
  }
  if (saleOnly) {
    breadcrumbItems.push({ label: 'Flash Deals', href: '/products?sale=true' })
  }
  if (newOnly) {
    breadcrumbItems.push({ label: 'New Arrivals', href: '/products?new=true' })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onToggleCategory={toggleCategory}
              onToggleBrand={toggleBrand}
              onToggleColor={toggleColor}
              onToggleRating={toggleRating}
              onSetPriceRange={setPriceRange}
              onSetInStock={setInStock}
              onSetOnSale={setOnSale}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Page Header */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-card">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-dark">
                    {category?.name || searchQuery ? `Search: "${searchQuery}"` : saleOnly ? 'Flash Deals' : newOnly ? 'New Arrivals' : 'All Products'}
                  </h1>
                  <p className="text-sm text-dark-muted mt-1">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-light-border rounded-lg text-dark-secondary hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="w-5 h-5 bg-primary-orange text-white text-xs rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Sort */}
                  <Select
                    options={sortOptions}
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    className="w-48"
                  />

                  {/* View Mode Toggle */}
                  <div className="hidden md:flex items-center border border-light-border rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-orange text-white' : 'text-dark-muted hover:text-dark'}`}
                      aria-label="Grid view"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.5 3A1.5 1.5 0 003 4.5v3A1.5 1.5 0 004.5 9h3A1.5 1.5 0 009 7.5v-3A1.5 1.5 0 007.5 3h-3zm8 0A1.5 1.5 0 0011 4.5v3A1.5 1.5 0 0012.5 9h3A1.5 1.5 0 0017 7.5v-3A1.5 1.5 0 0015.5 3h-3zm-8 8A1.5 1.5 0 003 12.5v3A1.5 1.5 0 004.5 17h3A1.5 1.5 0 009 15.5v-3A1.5 1.5 0 007.5 11h-3zm8 0A1.5 1.5 0 0011 12.5v3a1.5 1.5 0 001.5 1.5h3a1.5 1.5 0 001.5-1.5v-3A1.5 1.5 0 0015.5 11h-3z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-orange text-white' : 'text-dark-muted hover:text-dark'}`}
                      aria-label="List view"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 4.5A1.5 1.5 0 013.5 3h13A1.5 1.5 0 0118 4.5v2A1.5 1.5 0 0116.5 8h-13A1.5 1.5 0 012 6.5v-2zm0 7A1.5 1.5 0 013.5 10h13a1.5 1.5 0 011.5 1.5v2a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 13.5v-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilterCount > 0 && (
                <ActiveFilters
                  filters={filters}
                  onClearFilter={clearFilter}
                  onClearAll={clearFilters}
                  className="mt-4"
                />
              )}
            </div>

            {/* Products Grid/List */}
            {paginatedProducts.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                      : 'space-y-4'
                  }
                >
                  {paginatedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant={viewMode === 'list' ? 'horizontal' : 'default'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="mt-8"
                  />
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center shadow-card">
                <svg
                  className="w-16 h-16 mx-auto text-dark-muted mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-dark mb-2">No products found</h3>
                <p className="text-dark-muted mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="text-primary-orange hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-80 max-w-full bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-light-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                onToggleCategory={toggleCategory}
                onToggleBrand={toggleBrand}
                onToggleColor={toggleColor}
                onToggleRating={toggleRating}
                onSetPriceRange={setPriceRange}
                onSetInStock={setInStock}
                onSetOnSale={setOnSale}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
