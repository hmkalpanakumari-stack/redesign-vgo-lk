import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productService, reviewService } from '@/services'
import { useCart } from '@/context/CartContext'
import { useUI } from '@/context/UIContext'
import { formatStock } from '@/utils/formatters'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Badge, StockBadge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { Tabs } from '@/components/ui/Tabs'
import { ProductCard } from '@/components/common/ProductCard'
import { PriceDisplay, BulkPriceTable, SavingsDisplay } from '@/components/common/PriceDisplay'
import { QuantitySelector } from '@/components/common/QuantitySelector'
import { ReviewList, ReviewSummary } from '@/components/common/ReviewCard'
import { ImageGallery } from './components/ImageGallery'
import type { Product, ProductVariant } from '@/types/product'
import type { Review } from '@/types/order'

export function ProductDetailPage() {
  const { id } = useParams()
  const { addItem } = useCart()
  const { showToast } = useUI()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [ratingDistribution, setRatingDistribution] = useState<Record<number, number>>({})
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({})

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        // Fetch product by slug
        const productData = await productService.getProductBySlug(id)
        setProduct(productData)

        // Fetch reviews
        try {
          const reviewsData = await reviewService.getProductReviews(productData.id)
          setReviews(reviewsData.reviews.data)
          setRatingDistribution(reviewsData.summary.distribution)
        } catch {
          setReviews([])
          setRatingDistribution({})
        }

        // Fetch related products
        try {
          const relatedResponse = await productService.getProducts({
            category: productData.category.slug,
            limit: 5
          })
          setRelatedProducts(relatedResponse.data.filter(p => p.id !== productData.id).slice(0, 4))
        } catch {
          setRelatedProducts([])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="bg-light-bg min-h-screen">
        <div className="container py-6">
          <div className="bg-white rounded-xl shadow-card p-6 mb-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 animate-pulse rounded-xl h-96" />
              <div className="space-y-4">
                <div className="bg-gray-200 animate-pulse h-8 w-3/4 rounded" />
                <div className="bg-gray-200 animate-pulse h-6 w-1/2 rounded" />
                <div className="bg-gray-200 animate-pulse h-10 w-1/3 rounded" />
                <div className="bg-gray-200 animate-pulse h-24 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-dark mb-4">Product Not Found</h1>
        <p className="text-dark-muted mb-6">{error || "The product you're looking for doesn't exist."}</p>
        <Link to="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  // Group variants by type
  const variantsByType = product.variants?.reduce((acc, variant) => {
    if (!acc[variant.type]) {
      acc[variant.type] = []
    }
    acc[variant.type].push(variant)
    return acc
  }, {} as Record<string, ProductVariant[]>) || {}

  const handleVariantSelect = (type: string, variant: ProductVariant) => {
    setSelectedVariants(prev => ({ ...prev, [type]: variant }))
  }

  const handleAddToCart = () => {
    const selectedVariant = Object.values(selectedVariants)[0]
    addItem(product, selectedVariant, quantity)
    showToast('success', `${product.name} added to cart`)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    window.location.href = '/checkout'
  }

  const breadcrumbItems = [
    { label: 'Products', href: '/products' },
    { label: product.category.name, href: `/products/${product.category.slug}` },
    { label: product.name },
  ]

  const tabs = [
    {
      id: 'specs',
      label: 'Specifications',
      content: (
        <div className="space-y-4">
          {product.specifications?.map((spec, index) => (
            <div key={index} className="flex border-b border-light-border pb-2">
              <span className="w-1/3 text-dark-muted">{spec.label}</span>
              <span className="w-2/3 text-dark font-medium">{spec.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'description',
      label: 'Description',
      content: (
        <div className="prose max-w-none text-dark-secondary">
          <p>{product.description}</p>
        </div>
      ),
    },
    {
      id: 'reviews',
      label: `Reviews (${product.reviewCount})`,
      content: (
        <div className="space-y-8">
          <ReviewSummary
            rating={product.rating}
            reviewCount={product.reviewCount}
            distribution={ratingDistribution}
          />
          <hr className="border-light-border" />
          <ReviewList reviews={reviews} />
        </div>
      ),
    },
  ]

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        {/* Product Main Section */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <ImageGallery images={product.images} productName={product.name} />

            {/* Product Info */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {product.isNew && <Badge variant="new">New</Badge>}
                {product.isBestSeller && <Badge variant="hot">Best Seller</Badge>}
                {product.isOnSale && <Badge variant="sale">Sale</Badge>}
              </div>

              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-dark-muted mb-1">{product.brand}</p>
              )}

              {/* Name */}
              <h1 className="text-2xl lg:text-3xl font-bold text-dark mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-4">
                <Rating value={product.rating} showValue reviewCount={product.reviewCount} />
                <span className="text-sm text-dark-muted">|</span>
                <span className="text-sm text-dark-muted">{product.sku}</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <PriceDisplay price={product.price} size="xl" />
                {product.price.originalAmount && (
                  <SavingsDisplay
                    originalPrice={product.price.originalAmount}
                    currentPrice={product.price.amount}
                    className="mt-2"
                  />
                )}
              </div>

              {/* Bulk Pricing */}
              {product.bulkPrices && product.bulkPrices.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-dark mb-2">Bulk Pricing</h3>
                  <BulkPriceTable prices={product.bulkPrices} />
                </div>
              )}

              {/* Short Description */}
              {product.shortDescription && (
                <p className="text-dark-secondary mb-6">{product.shortDescription}</p>
              )}

              {/* Variants */}
              {Object.entries(variantsByType).map(([type, variants]) => (
                <div key={type} className="mb-6">
                  <h3 className="text-sm font-medium text-dark mb-3 capitalize">
                    Select {type}: {selectedVariants[type]?.name || 'Choose an option'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {variants.map(variant => (
                      <button
                        key={variant.id}
                        onClick={() => handleVariantSelect(type, variant)}
                        disabled={variant.stock === 0}
                        className={`
                          ${type === 'color'
                            ? 'w-10 h-10 rounded-full border-2'
                            : 'px-4 py-2 rounded-lg border text-sm font-medium'
                          }
                          ${selectedVariants[type]?.id === variant.id
                            ? 'border-primary-orange ring-2 ring-primary-orange ring-offset-2'
                            : 'border-light-border hover:border-dark-muted'
                          }
                          ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                          transition-all
                        `}
                        style={type === 'color' ? { backgroundColor: variant.colorCode } : undefined}
                        title={variant.name}
                      >
                        {type !== 'color' && variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-dark mb-3">Quantity</h3>
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  max={product.stock}
                />
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-6">
                <StockBadge stock={product.stock} />
                <span className="text-sm text-dark-muted">{formatStock(product.stock)}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  Buy Now
                </Button>
                <button className="p-3 border border-light-border rounded-lg hover:border-primary-orange hover:text-primary-orange transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* Delivery Info */}
              {product.deliveryInfo && (
                <div className="flex items-center gap-2 p-4 bg-light-bg rounded-lg">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-dark">{product.deliveryInfo}</span>
                </div>
              )}

              {/* Warranty */}
              {product.warranty && (
                <div className="flex items-center gap-2 mt-2 text-sm text-dark-muted">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {product.warranty}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          <Tabs tabs={tabs} defaultTab="specs" />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
