import { Link } from 'react-router-dom'
import type { Category } from '@/types/product'

interface CategoryCardProps {
  category: Category
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

export function CategoryCard({
  category,
  variant = 'default',
  className = '',
}: CategoryCardProps) {
  if (variant === 'compact') {
    return (
      <Link
        to={`/products/${category.slug}`}
        className={`
          flex flex-col items-center justify-center p-4 bg-white rounded-xl
          shadow-card hover:shadow-card-hover transition-all
          hover:-translate-y-1
          ${className}
        `}
      >
        <span className="text-3xl mb-2">{category.icon}</span>
        <span className="text-sm font-medium text-dark text-center">{category.name}</span>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/products/${category.slug}`}
        className={`
          relative block overflow-hidden rounded-xl group
          ${className}
        `}
      >
        {/* Background Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="text-xl font-bold mb-1">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-white/80 line-clamp-2">{category.description}</p>
          )}
          {category.productCount && (
            <p className="text-sm text-white/60 mt-2">{category.productCount} products</p>
          )}
        </div>
      </Link>
    )
  }

  // Default variant
  return (
    <Link
      to={`/products/${category.slug}`}
      className={`
        block bg-white rounded-xl shadow-card hover:shadow-card-hover
        transition-all hover:-translate-y-1 overflow-hidden
        ${className}
      `}
    >
      {/* Image */}
      {category.imageUrl && (
        <div className="aspect-square overflow-hidden">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4 text-center">
        {category.icon && !category.imageUrl && (
          <span className="text-4xl block mb-2">{category.icon}</span>
        )}
        <h3 className="font-semibold text-dark">{category.name}</h3>
        {category.productCount && (
          <p className="text-sm text-dark-muted mt-1">{category.productCount} items</p>
        )}
      </div>
    </Link>
  )
}

interface CategoryGridProps {
  categories: Category[]
  variant?: 'default' | 'compact' | 'featured'
  columns?: number
  className?: string
}

export function CategoryGrid({
  categories,
  variant = 'default',
  columns = 6,
  className = '',
}: CategoryGridProps) {
  const gridCols = {
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-6'} gap-4 ${className}`}>
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} variant={variant} />
      ))}
    </div>
  )
}
