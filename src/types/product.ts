export interface PriceInfo {
  amount: number
  originalAmount?: number
  currency: string
  discountPercentage?: number
}

export interface BulkPrice {
  minQuantity: number
  maxQuantity?: number
  pricePerUnit: number
}

export interface ProductVariant {
  id: string
  name: string
  type: 'color' | 'size' | 'storage' | 'material' | 'other'
  value: string
  colorCode?: string
  priceModifier?: number
  stock: number
  sku: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary?: boolean
}

export interface ProductSpecification {
  label: string
  value: string
  group?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: PriceInfo
  bulkPrices?: BulkPrice[]
  images: ProductImage[]
  category: Category
  subCategory?: string
  brand?: string
  variants?: ProductVariant[]
  specifications?: ProductSpecification[]
  stock: number
  sku: string
  rating: number
  reviewCount: number
  isFeatured?: boolean
  isNew?: boolean
  isOnSale?: boolean
  isBestSeller?: boolean
  tags?: string[]
  warranty?: string
  deliveryInfo?: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  icon?: string
  parentId?: string
  productCount?: number
  children?: Category[]
}

export interface FilterOption {
  id: string
  label: string
  value: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'range' | 'color'
  options: FilterOption[]
}

export interface PriceRange {
  min: number
  max: number
}

export interface ProductFilters {
  categories?: string[]
  brands?: string[]
  priceRange?: PriceRange
  colors?: string[]
  sizes?: string[]
  ratings?: number[]
  inStock?: boolean
  onSale?: boolean
}

export type SortOption =
  | 'relevance'
  | 'price-low-high'
  | 'price-high-low'
  | 'newest'
  | 'rating'
  | 'best-selling'

export interface ProductListParams {
  page: number
  limit: number
  sort: SortOption
  filters: ProductFilters
  search?: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
  filters: FilterGroup[]
}
