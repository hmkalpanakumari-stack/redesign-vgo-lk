import { useState, useMemo, useCallback } from 'react'
import type { Product, ProductFilters, SortOption, PriceRange } from '@/types/product'

interface UseFiltersReturn {
  filters: ProductFilters
  sort: SortOption
  setFilters: (filters: ProductFilters) => void
  setSort: (sort: SortOption) => void
  toggleCategory: (categoryId: string) => void
  toggleBrand: (brand: string) => void
  toggleColor: (color: string) => void
  toggleSize: (size: string) => void
  toggleRating: (rating: number) => void
  setPriceRange: (range: PriceRange) => void
  setInStock: (inStock: boolean) => void
  setOnSale: (onSale: boolean) => void
  clearFilters: () => void
  clearFilter: (filterKey: keyof ProductFilters) => void
  applyFilters: (products: Product[]) => Product[]
  activeFilterCount: number
}

const initialFilters: ProductFilters = {}

export function useFilters(initialSort: SortOption = 'relevance'): UseFiltersReturn {
  const [filters, setFilters] = useState<ProductFilters>(initialFilters)
  const [sort, setSort] = useState<SortOption>(initialSort)

  const toggleArrayFilter = useCallback(
    <T extends string | number>(
      key: keyof ProductFilters,
      value: T
    ) => {
      setFilters(prev => {
        const currentArray = (prev[key] as T[] | undefined) || []
        const exists = currentArray.includes(value)
        const newArray = exists
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
        return { ...prev, [key]: newArray.length > 0 ? newArray : undefined }
      })
    },
    []
  )

  const toggleCategory = useCallback((categoryId: string) => {
    toggleArrayFilter('categories', categoryId)
  }, [toggleArrayFilter])

  const toggleBrand = useCallback((brand: string) => {
    toggleArrayFilter('brands', brand)
  }, [toggleArrayFilter])

  const toggleColor = useCallback((color: string) => {
    toggleArrayFilter('colors', color)
  }, [toggleArrayFilter])

  const toggleSize = useCallback((size: string) => {
    toggleArrayFilter('sizes', size)
  }, [toggleArrayFilter])

  const toggleRating = useCallback((rating: number) => {
    toggleArrayFilter('ratings', rating)
  }, [toggleArrayFilter])

  const setPriceRange = useCallback((range: PriceRange) => {
    setFilters(prev => ({ ...prev, priceRange: range }))
  }, [])

  const setInStock = useCallback((inStock: boolean) => {
    setFilters(prev => ({ ...prev, inStock: inStock || undefined }))
  }, [])

  const setOnSale = useCallback((onSale: boolean) => {
    setFilters(prev => ({ ...prev, onSale: onSale || undefined }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
  }, [])

  const clearFilter = useCallback((filterKey: keyof ProductFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[filterKey]
      return newFilters
    })
  }, [])

  const applyFilters = useCallback(
    (products: Product[]): Product[] => {
      let filtered = [...products]

      // Filter by categories
      if (filters.categories?.length) {
        filtered = filtered.filter(
          p =>
            filters.categories!.includes(p.category.slug) ||
            (p.subCategory && filters.categories!.includes(p.subCategory))
        )
      }

      // Filter by brands
      if (filters.brands?.length) {
        filtered = filtered.filter(
          p => p.brand && filters.brands!.includes(p.brand)
        )
      }

      // Filter by price range
      if (filters.priceRange) {
        filtered = filtered.filter(
          p =>
            p.price.amount >= filters.priceRange!.min &&
            p.price.amount <= filters.priceRange!.max
        )
      }

      // Filter by colors
      if (filters.colors?.length) {
        filtered = filtered.filter(p =>
          p.variants?.some(
            v => v.type === 'color' && filters.colors!.includes(v.value)
          )
        )
      }

      // Filter by sizes
      if (filters.sizes?.length) {
        filtered = filtered.filter(p =>
          p.variants?.some(
            v => v.type === 'size' && filters.sizes!.includes(v.value)
          )
        )
      }

      // Filter by ratings
      if (filters.ratings?.length) {
        const minRating = Math.min(...filters.ratings)
        filtered = filtered.filter(p => p.rating >= minRating)
      }

      // Filter by stock
      if (filters.inStock) {
        filtered = filtered.filter(p => p.stock > 0)
      }

      // Filter by sale
      if (filters.onSale) {
        filtered = filtered.filter(p => p.isOnSale)
      }

      // Sort products
      switch (sort) {
        case 'price-low-high':
          filtered.sort((a, b) => a.price.amount - b.price.amount)
          break
        case 'price-high-low':
          filtered.sort((a, b) => b.price.amount - a.price.amount)
          break
        case 'newest':
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          break
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating)
          break
        case 'best-selling':
          filtered.sort((a, b) => b.reviewCount - a.reviewCount)
          break
        default:
          // relevance - keep original order
          break
      }

      return filtered
    },
    [filters, sort]
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.categories?.length) count += filters.categories.length
    if (filters.brands?.length) count += filters.brands.length
    if (filters.colors?.length) count += filters.colors.length
    if (filters.sizes?.length) count += filters.sizes.length
    if (filters.ratings?.length) count++
    if (filters.priceRange) count++
    if (filters.inStock) count++
    if (filters.onSale) count++
    return count
  }, [filters])

  return {
    filters,
    sort,
    setFilters,
    setSort,
    toggleCategory,
    toggleBrand,
    toggleColor,
    toggleSize,
    toggleRating,
    setPriceRange,
    setInStock,
    setOnSale,
    clearFilters,
    clearFilter,
    applyFilters,
    activeFilterCount,
  }
}
