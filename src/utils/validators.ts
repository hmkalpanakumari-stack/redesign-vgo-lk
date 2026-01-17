export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  // Sri Lankan phone number validation
  const cleaned = phone.replace(/\D/g, '')
  // Accepts: +94XXXXXXXXX, 94XXXXXXXXX, 0XXXXXXXXX
  return /^(94|0)?[0-9]{9}$/.test(cleaned)
}

export function isValidPostalCode(postalCode: string): boolean {
  // Sri Lankan postal codes are 5 digits
  return /^\d{5}$/.test(postalCode)
}

export function isValidPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return { isValid: errors.length === 0, errors }
}

export function isValidCreditCard(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length < 13 || cleaned.length > 19) return false

  // Luhn algorithm
  let sum = 0
  let isEven = false
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10)
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    isEven = !isEven
  }
  return sum % 10 === 0
}

export function isValidCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv)
}

export function isValidExpiryDate(expiry: string): boolean {
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
  if (!match) return false

  const month = parseInt(match[1], 10)
  const year = parseInt('20' + match[2], 10)
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1

  if (year < currentYear) return false
  if (year === currentYear && month < currentMonth) return false

  return true
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

export function validateMinLength(value: string, minLength: number, fieldName: string): string | null {
  if (value.length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`
  }
  return null
}

export function validateMaxLength(value: string, maxLength: number, fieldName: string): string | null {
  if (value.length > maxLength) {
    return `${fieldName} must be at most ${maxLength} characters`
  }
  return null
}

export function validateMatch(value: string, matchValue: string, fieldName: string): string | null {
  if (value !== matchValue) {
    return `${fieldName} does not match`
  }
  return null
}

export interface FormErrors {
  [key: string]: string | null
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.values(errors).some(error => error !== null)
}

export function validateAddress(address: {
  firstName?: string
  lastName?: string
  phone?: string
  addressLine1?: string
  city?: string
  district?: string
  postalCode?: string
}): FormErrors {
  const errors: FormErrors = {}

  errors.firstName = validateRequired(address.firstName || '', 'First name')
  errors.lastName = validateRequired(address.lastName || '', 'Last name')

  if (!address.phone) {
    errors.phone = 'Phone number is required'
  } else if (!isValidPhone(address.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  errors.addressLine1 = validateRequired(address.addressLine1 || '', 'Address')
  errors.city = validateRequired(address.city || '', 'City')
  errors.district = validateRequired(address.district || '', 'District')

  if (!address.postalCode) {
    errors.postalCode = 'Postal code is required'
  } else if (!isValidPostalCode(address.postalCode)) {
    errors.postalCode = 'Please enter a valid postal code'
  }

  return errors
}
