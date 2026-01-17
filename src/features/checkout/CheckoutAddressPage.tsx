import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCheckout } from './CheckoutPage'
import { sampleAddresses, sriLankanDistricts } from '@/data/users'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { validateAddress, hasErrors } from '@/utils/validators'
import type { Address } from '@/types/user'

export function CheckoutAddressPage() {
  const navigate = useNavigate()
  const { state: authState } = useAuth()
  const { setShippingAddress } = useCheckout()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    authState.isAuthenticated ? sampleAddresses[0]?.id || null : null
  )
  const [showNewAddressForm, setShowNewAddressForm] = useState(!authState.isAuthenticated)
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  // Form state for new address
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    postalCode: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleSavedAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId)
    setShowNewAddressForm(false)
  }

  const handleContinue = () => {
    if (!showNewAddressForm && selectedAddressId) {
      // Use saved address
      const address = sampleAddresses.find(a => a.id === selectedAddressId)
      if (address) {
        setShippingAddress(address)
        navigate('/checkout/shipping')
      }
    } else {
      // Validate and use new address
      const validationErrors = validateAddress(formData)
      setErrors(validationErrors)

      if (!hasErrors(validationErrors)) {
        const newAddress: Address = {
          id: `addr-${Date.now()}`,
          userId: authState.user?.id || 'guest',
          label: 'Home',
          ...formData,
          country: 'Sri Lanka',
          isDefault: false,
          type: 'home',
        }
        setShippingAddress(newAddress)
        navigate('/checkout/shipping')
      }
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold text-dark mb-6">Delivery Address</h2>

      {/* Saved Addresses */}
      {authState.isAuthenticated && sampleAddresses.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium text-dark mb-4">Saved Addresses</h3>
          <div className="space-y-3">
            {sampleAddresses.map(address => (
              <label
                key={address.id}
                className={`
                  flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors
                  ${selectedAddressId === address.id && !showNewAddressForm
                    ? 'border-primary-orange bg-primary-orange/5'
                    : 'border-light-border hover:border-dark-muted'
                  }
                `}
              >
                <input
                  type="radio"
                  name="savedAddress"
                  checked={selectedAddressId === address.id && !showNewAddressForm}
                  onChange={() => handleSavedAddressSelect(address.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-dark">
                      {address.firstName} {address.lastName}
                    </span>
                    {address.isDefault && (
                      <span className="px-2 py-0.5 bg-primary-orange/10 text-primary-orange text-xs rounded-full">
                        Default
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 text-dark-muted text-xs rounded-full capitalize">
                      {address.type}
                    </span>
                  </div>
                  <p className="text-sm text-dark-muted mt-1">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-sm text-dark-muted">
                    {address.city}, {address.district} {address.postalCode}
                  </p>
                  <p className="text-sm text-dark-muted">{address.phone}</p>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => setShowNewAddressForm(true)}
            className="mt-4 text-primary-orange hover:underline text-sm font-medium"
          >
            + Add New Address
          </button>
        </div>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="space-y-4">
          {authState.isAuthenticated && (
            <button
              onClick={() => setShowNewAddressForm(false)}
              className="text-sm text-dark-muted hover:text-dark"
            >
              ← Back to saved addresses
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              error={errors.firstName || undefined}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              error={errors.lastName || undefined}
              required
            />
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+94 7X XXX XXXX"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone || undefined}
            required
          />

          <Input
            label="Address Line 1"
            placeholder="Street address, P.O. box, company name"
            value={formData.addressLine1}
            onChange={(e) => handleInputChange('addressLine1', e.target.value)}
            error={errors.addressLine1 || undefined}
            required
          />

          <Input
            label="Address Line 2 (Optional)"
            placeholder="Apartment, suite, unit, building, floor, etc."
            value={formData.addressLine2}
            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              error={errors.city || undefined}
              required
            />
            <Select
              label="District"
              options={sriLankanDistricts.map(d => ({ value: d, label: d }))}
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              placeholder="Select district"
              error={errors.district || undefined}
            />
          </div>

          <Input
            label="Postal Code"
            placeholder="00000"
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            error={errors.postalCode || undefined}
            required
          />
        </div>
      )}

      {/* Continue Button */}
      <div className="mt-6 flex gap-4">
        <Button variant="ghost" onClick={() => navigate('/checkout')}>
          Back
        </Button>
        <Button variant="primary" onClick={handleContinue} className="flex-1">
          Continue to Shipping
        </Button>
      </div>
    </div>
  )
}
