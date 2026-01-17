import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, getBestSellers, getNewProducts } from '@/data/products'
import { ProductCard } from '@/components/common/ProductCard'

type TabType = 'featured' | 'bestsellers' | 'new'

const tabs = [
  { id: 'featured' as TabType, label: 'Featured' },
  { id: 'bestsellers' as TabType, label: 'Best Sellers' },
  { id: 'new' as TabType, label: 'New Arrivals' },
]

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>('featured')

  const getProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return getBestSellers()
      case 'new':
        return getNewProducts()
      default:
        return getFeaturedProducts()
    }
  }

  const products = getProducts().slice(0, 8)

  return (
    <section className="py-12">
      <div className="container">
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-dark">Popular Products</h2>

          {/* Tabs */}
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-orange text-white'
                    : 'bg-gray-100 text-dark-secondary hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-blue-hover transition-colors"
          >
            Explore All Products
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
