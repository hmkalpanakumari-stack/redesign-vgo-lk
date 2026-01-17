interface RatingProps {
  value: number
  maxValue?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
  onChange?: (value: number) => void
  readonly?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
}

export function Rating({
  value,
  maxValue = 5,
  size = 'md',
  showValue = false,
  reviewCount,
  onChange,
  readonly = true,
  className = '',
}: RatingProps) {
  const stars = Array.from({ length: maxValue }, (_, i) => i + 1)

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating)
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {stars.map(star => {
          const filled = star <= Math.floor(value)
          const partial = star === Math.ceil(value) && value % 1 !== 0
          const percentage = partial ? (value % 1) * 100 : 0

          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              disabled={readonly}
              className={`
                relative
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                transition-transform
              `}
              aria-label={`${star} star${star !== 1 ? 's' : ''}`}
            >
              {/* Empty star */}
              <svg
                className={`${sizeClasses[size]} text-gray-300`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>

              {/* Filled star overlay */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : partial ? `${percentage}%` : '0%' }}
              >
                <svg
                  className={`${sizeClasses[size]} text-yellow-400`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </button>
          )
        })}
      </div>

      {(showValue || reviewCount !== undefined) && (
        <span className="text-sm text-dark-muted ml-1">
          {showValue && <span className="font-medium text-dark">{value.toFixed(1)}</span>}
          {reviewCount !== undefined && (
            <span>
              {showValue && ' '}({reviewCount.toLocaleString()})
            </span>
          )}
        </span>
      )}
    </div>
  )
}
