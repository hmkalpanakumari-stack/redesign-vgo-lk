import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useUI } from '@/context/UIContext'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export function ProfilePage() {
  const { state } = useAuth()
  const { showToast } = useUI()

  const [formData, setFormData] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    dateOfBirth: state.user?.dateOfBirth || '',
    gender: state.user?.gender || '',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    { label: 'Profile', href: '/account/profile' },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast('success', 'Profile updated successfully!')
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: state.user?.firstName || '',
      lastName: state.user?.lastName || '',
      email: state.user?.email || '',
      phone: state.user?.phone || '',
      dateOfBirth: state.user?.dateOfBirth || '',
      gender: state.user?.gender || '',
    })
    setIsEditing(false)
  }

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <h1 className="text-2xl font-bold text-dark mb-6">Profile Settings</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-primary-orange/10 rounded-full flex items-center justify-center">
                {state.user?.avatarUrl ? (
                  <img
                    src={state.user.avatarUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-primary-orange">
                    {state.user?.firstName?.[0]}{state.user?.lastName?.[0]}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-dark mb-1">
                {state.user?.firstName} {state.user?.lastName}
              </h3>
              <p className="text-sm text-dark-muted mb-4">{state.user?.email}</p>
              <Button variant="outline" size="sm" fullWidth>
                Change Photo
              </Button>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-dark">Personal Information</h2>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  disabled={!isEditing}
                />

                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 border border-light-border rounded-lg focus:ring-2 focus:ring-primary-orange focus:border-transparent disabled:bg-light-bg-alt disabled:cursor-not-allowed"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="primary"
                      onClick={handleSave}
                      isLoading={isSaving}
                    >
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Password Change */}
            <Card className="p-6 mt-6">
              <h2 className="text-lg font-semibold text-dark mb-4">Change Password</h2>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Confirm new password"
                />
                <Button variant="primary">Update Password</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
