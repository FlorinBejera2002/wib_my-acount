import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent
} from '@/components/ui/card'
import { useNotifications } from '@/hooks/use-notifications'
import { formatDate } from '@/lib/utils'
import { Bell, Check, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function NotificationsPage() {
  const { t } = useTranslation()
  const { data: notifications, isLoading } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">{t('notifications.title')}</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const filteredNotifications =
    notifications?.filter((n) => {
      if (filter === 'unread') return !n.read
      if (filter === 'read') return n.read
      return true
    }) ?? []

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">{t('notifications.title')}</h1>
            <p className="text-sm text-gray-500">
              {unreadCount > 0
                ? t('notifications.unreadCount', { count: unreadCount })
                : t('notifications.allNotificationsRead')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            {t('notifications.all')}
          </Button>
          <Button
            variant={filter === 'unread' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            {t('notifications.unread')}
          </Button>
          <Button
            variant={filter === 'read' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('read')}
          >
            {t('notifications.read')}
          </Button>
        </div>
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filter === 'unread'
                ? t('notifications.noUnread')
                : filter === 'read'
                  ? t('notifications.noRead')
                  : t('notifications.noNotifications')}
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              {filter === 'unread'
                ? t('notifications.allReadMessage')
                : filter === 'read'
                  ? t('notifications.noReadYet')
                  : t('notifications.noNotificationsYet')}
            </p>
            {filter !== 'all' && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setFilter('all')}
              >
                {t('notifications.viewAll')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? 'opacity-75' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3
                          className={`font-semibold text-gray-900 ${!notification.read ? 'font-bold' : ''}`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                          {notification.type && (
                            <Badge variant="secondary" className="text-xs">
                              {notification.type}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
