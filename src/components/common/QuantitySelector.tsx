interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const sizeClasses = {
  sm: {
    button: 'w-7 h-7',
    input: 'w-10 h-7 text-sm',
    icon: 'w-3 h-3',
  },
  md: {
    button: 'w-9 h-9',
    input: 'w-14 h-9',
    icon: 'w-4 h-4',
  },
  lg: {
    button: 'w-11 h-11',
    input: 'w-16 h-11 text-lg',
    icon: 'w-5 h-5',
  },
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  disabled = false,
  className = '',
}: QuantitySelectorProps) {
  const styles = sizeClasses[size]

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10)
    if (!isNaN(newValue)) {
      if (newValue < min) {
        onChange(min)
      } else if (newValue > max) {
        onChange(max)
      } else {
        onChange(newValue)
      }
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className={`
          ${styles.button}
          flex items-center justify-center
          border border-light-border rounded-l-lg
          text-dark-muted hover:text-dark hover:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
        aria-label="Decrease quantity"
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        disabled={disabled}
        min={min}
        max={max}
        className={`
          ${styles.input}
          border-t border-b border-light-border
          text-center font-medium text-dark
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-blue
          disabled:opacity-50 disabled:cursor-not-allowed
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
        `}
        aria-label="Quantity"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className={`
          ${styles.button}
          flex items-center justify-center
          border border-light-border rounded-r-lg
          text-dark-muted hover:text-dark hover:bg-gray-100
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
        aria-label="Increase quantity"
      >
        <svg className={styles.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}
