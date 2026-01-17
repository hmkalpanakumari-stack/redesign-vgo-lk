import { useState } from 'react'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function NotificationsPage() {
  const [notifications] = useState<never[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'My Account', href: '/account' },
    { label: 'Notifications', href: '/account/notifications' },
  ]

  return (
    <div className="bg-light-bg min-h-screen">
      <div className="container py-6">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-dark">Notifications</h1>
          {notifications.length > 0 && (
            <Button variant="outline" size="sm">Mark All as Read</Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread
          </Button>
        </div>

        {notifications.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-semibold text-dark mb-2">No notifications</h2>
            <p className="text-dark-muted">
              You're all caught up! Check back later for updates.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((_, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-orange/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-dark">Notification Title</h3>
                      <Badge>New</Badge>
                    </div>
                    <p className="text-sm text-dark-secondary mb-2">
                      Notification message content goes here.
                    </p>
                    <p className="text-xs text-dark-muted">2 hours ago</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
