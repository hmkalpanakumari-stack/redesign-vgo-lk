import { InputHTMLAttributes, forwardRef } from 'react'

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, className = '', id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className={`flex items-start ${className}`}>
        <div className="flex items-center h-5">
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className="
              w-4 h-4 border-light-border
              text-primary-orange
              focus:ring-primary-orange focus:ring-2 focus:ring-offset-0
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <label
                htmlFor={radioId}
                className="text-sm font-medium text-dark cursor-pointer"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-dark-muted">{description}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

interface RadioGroupProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string; description?: string; disabled?: boolean }[]
  className?: string
}

export function RadioGroup({ name, value, onChange, options, className = '' }: RadioGroupProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {options.map(option => (
        <Radio
          key={option.value}
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={() => onChange(option.value)}
          label={option.label}
          description={option.description}
          disabled={option.disabled}
        />
      ))}
    </div>
  )
}
