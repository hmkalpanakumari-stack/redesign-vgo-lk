interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  animation?: 'pulse' | 'wave' | 'none'
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200'

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse', // Could implement wave animation with CSS
    none: '',
  }

  const style: React.CSSProperties = {
    width: width,
    height: height,
  }

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  )
}

// Preset skeleton components for common use cases
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden">
      <Skeleton className="aspect-product w-full" />
      <div className="p-4 space-y-3">
        <Skeleton height={12} width="60%" />
        <Skeleton height={16} width="100%" />
        <Skeleton height={20} width="40%" />
        <div className="flex gap-2 pt-2">
          <Skeleton height={36} className="flex-1" />
          <Skeleton height={36} width={36} />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden p-4">
      <Skeleton variant="circular" width={64} height={64} className="mx-auto" />
      <Skeleton height={16} width="80%" className="mx-auto mt-3" />
      <Skeleton height={12} width="50%" className="mx-auto mt-2" />
    </div>
  )
}

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border-b border-light-border">
      <Skeleton width={100} height={100} />
      <div className="flex-1 space-y-2">
        <Skeleton height={16} width="70%" />
        <Skeleton height={12} width="40%" />
        <Skeleton height={20} width="30%" />
      </div>
    </div>
  )
}

export function TextBlockSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  )
}
