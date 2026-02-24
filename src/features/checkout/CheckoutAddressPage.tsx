import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useCheckout } from './CheckoutPage'
import { addressService } from '@/services/addressService'
import { sriLankanDistricts } from '@/data/users'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { validateAddress, hasErrors } from '@/utils/validators'
import type { Address } from '@/types/user'

export function CheckoutAddressPage() {
  const navigate = useNavigate()
  const { state: authState } = useAuth()
  const { setShippingAddress } = useCheckout()

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(!authState.isAuthenticated)
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [isSaving, setIsSaving] = useState(false)

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

  // Fetch user addresses if authenticated
  useEffect(() => {
    if (!authState.isAuthenticated) return

    setLoadingAddresses(true)
    addressService.getAddresses()
      .then((addresses) => {
        setSavedAddresses(addresses)
        const defaultAddr = addresses.find(a => a.isDefault) || addresses[0]
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id)
          setShowNewAddressForm(false)
        } else {
          setShowNewAddressForm(true)
        }
      })
      .catch(() => {
        setShowNewAddressForm(true)
      })
      .finally(() => setLoadingAddresses(false))
  }, [authState.isAuthenticated])

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

  const handleContinue = async () => {
    if (!showNewAddressForm && selectedAddressId) {
      // Use saved address
      const address = savedAddresses.find(a => a.id === selectedAddressId)
      if (address) {
        setShippingAddress(address)
        navigate('/checkout/shipping')
      }
      return
    }

    // Validate new address form
    const validationErrors = validateAddress(formData)
    setErrors(validationErrors)

    if (hasErrors(validationErrors)) return

    const newAddressData = {
      label: 'Home',
      ...formData,
      country: 'Sri Lanka',
      isDefault: false,
      type: 'home' as const,
    }

    if (authState.isAuthenticated) {
      // Save to backend and use the returned address (with real ID)
      setIsSaving(true)
      try {
        const savedAddress = await addressService.createAddress(newAddressData)
        setShippingAddress(savedAddress)
        navigate('/checkout/shipping')
      } catch {
        // Fall back to local address object on error
        const localAddress: Address = {
          id: `addr-${Date.now()}`,
          ...newAddressData,
        }
        setShippingAddress(localAddress)
        navigate('/checkout/shipping')
      } finally {
        setIsSaving(false)
      }
    } else {
      // Guest checkout - use local address
      const guestAddress: Address = {
        id: `addr-${Date.now()}`,
        ...newAddressData,
      }
      setShippingAddress(guestAddress)
      navigate('/checkout/shipping')
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h2 className="text-xl font-semibold text-dark mb-6">Delivery Address</h2>

      {/* Saved Addresses */}
      {authState.isAuthenticated && (
        <div className="mb-6">
          {loadingAddresses ? (
            <p className="text-dark-muted text-sm">Loading your addresses...</p>
          ) : savedAddresses.length > 0 ? (
            <>
              <h3 className="font-medium text-dark mb-4">Saved Addresses</h3>
              <div className="space-y-3">
                {savedAddresses.map(address => (
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
            </>
          ) : null}
        </div>
      )}

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="space-y-4">
          {authState.isAuthenticated && savedAddresses.length > 0 && (
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
        <Button variant="primary" onClick={handleContinue} className="flex-1" isLoading={isSaving}>
          Continue to Shipping
        </Button>
      </div>
    </div>
  )
}
