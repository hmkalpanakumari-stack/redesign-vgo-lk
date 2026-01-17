import { useState } from 'react'
import { useUI } from '@/context/UIContext'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function AddressesPage() {
  const { showToast } = useUI()
  const [addresses] = useState<never[]>([])

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    { label: 'Addresses', href: '/account/addresses' },
  ]

  const handleAddNew = () => {
    showToast('info', 'Add address feature coming soon!')
  }

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark">Saved Addresses</h1>
          <Button onClick={handleAddNew}>Add New Address</Button>
        </div>

        {addresses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-xl font-semibold text-dark mb-2">No saved addresses</h2>
            <p className="text-dark-muted mb-6">
              Add your delivery addresses for faster checkout.
            </p>
            <Button onClick={handleAddNew}>Add Your First Address</Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((_, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge>Default</Badge>
                  <div className="flex gap-2">
                    <button className="text-sm text-primary-orange hover:underline">
                      Edit
                    </button>
                    <button className="text-sm text-error hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
                {/* Address details will be shown here */}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
