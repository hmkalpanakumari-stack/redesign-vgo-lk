import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categoryService } from '@/services'
import type { Category } from '@/types/product'

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories()
        setCategories(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-12 bg-light-bg">
        <div className="container">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-32" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12 bg-light-bg">
        <div className="container text-center text-red-500">{error}</div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-light-bg">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark">Shop by Category</h2>
          <Link
            to="/products"
            className="text-primary-orange hover:text-primary-orange-hover font-medium flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(category => (
            <Link
              key={category.id}
              to={`/products/${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-light-bg-soft rounded-full flex items-center justify-center group-hover:bg-primary-orange/10 transition-colors">
                  <span className="text-3xl">{category.icon}</span>
                </div>
                <h3 className="font-medium text-dark group-hover:text-primary-orange transition-colors">
                  {category.name}
                </h3>
                {category.productCount && (
                  <p className="text-xs text-dark-muted mt-1">{category.productCount} items</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
