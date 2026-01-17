import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOnSaleProducts } from '@/data/products'
import { flashSaleConfig } from '@/data/content'
import { formatCountdown } from '@/utils/formatters'
import { ProductCard } from '@/components/common/ProductCard'

export function FlashDeals() {
  const flashProducts = getOnSaleProducts().slice(0, 4)
  const [countdown, setCountdown] = useState(formatCountdown(flashSaleConfig.endTime))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(formatCountdown(flashSaleConfig.endTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-12">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">⚡</span>
              <h2 className="text-2xl font-bold text-dark">{flashSaleConfig.title}</h2>
              <span className="px-2 py-0.5 bg-error text-white text-xs font-medium rounded-full animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-dark-muted">{flashSaleConfig.subtitle}</p>
          </div>

          {/* Countdown Timer */}
          {!countdown.isExpired && (
            <div className="flex items-center gap-3">
              <span className="text-dark-muted text-sm">Ends in:</span>
              <div className="flex gap-2">
                {[
                  { value: countdown.hours, label: 'Hours' },
                  { value: countdown.minutes, label: 'Min' },
                  { value: countdown.seconds, label: 'Sec' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="w-14 bg-dark text-white rounded-lg p-2 text-center"
                  >
                    <span className="text-xl font-bold block">
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-white/60">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {flashProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link
            to="/products?sale=true"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary-orange text-primary-orange rounded-lg font-medium hover:bg-primary-orange hover:text-white transition-colors"
          >
            View All Deals
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
