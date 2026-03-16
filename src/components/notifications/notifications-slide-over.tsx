import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useNotifications } from '@/hooks/use-notifications'
import { formatDate } from '@/lib/utils'
import { Bell, Check, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface NotificationsSlideOverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationsSlideOver({
  open,
  onOpenChange
}: NotificationsSlideOverProps) {
  const { t } = useTranslation()
  const { data: notifications, isLoading } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const filteredNotifications =
    notifications?.filter((n) => {
      if (filter === 'unread') return !n.read
      if (filter === 'read') return n.read
      return true
    }) ?? []

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  const handleMarkAsRead = (_id: string) => {
    // TODO: implementează marcarea ca citită
  }

  const handleDelete = (_id: string) => {
    // TODO: implementează ștergerea notificării
  }

  const handleMarkAllAsRead = () => {
    // TODO: implementează marcarea tuturor ca citite
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Slide Over */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <h2 className="font-semibold text-gray-900">{t('notifications.title')}</h2>
                <p className="text-xs text-gray-500">
                  {unreadCount > 0 ? t('notifications.unreadCount', { count: unreadCount }) : t('notifications.allRead')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 p-4 border-b">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex-1"
            >
              {t('notifications.all')}
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="flex-1"
            >
              {t('notifications.unread')}
            </Button>
            <Button
              variant={filter === 'read' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('read')}
              className="flex-1"
            >
              {t('notifications.read')}
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">
                    {filter === 'unread'
                      ? t('notifications.noUnread')
                      : filter === 'read'
                        ? t('notifications.noRead')
                        : t('notifications.noNotifications')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={!notification.read ? 'bg-blue-50/50' : ''}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3
                                  className={`text-sm font-medium ${
                                    !notification.read
                                      ? 'text-blue-900 font-semibold'
                                      : notification.type === 'POLICY_EXPIRY'
                                        ? 'text-red-700' // Expiry - red (critical)
                                        : notification.type === 'QUOTE_READY'
                                          ? 'text-green-700' // Ready - green (positive)
                                          : notification.type ===
                                              'PASSWORD_CHANGE'
                                            ? 'text-amber-700' // Security - amber (warning)
                                            : 'text-gray-900' // Default - gray
                                  }`}
                                >
                                  {notification.title}
                                </h3>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-gray-500">
                                    {formatDate(notification.createdAt)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      handleMarkAsRead(notification.id)
                                    }
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleDelete(notification.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
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
          </div>

          {/* Footer */}
          {unreadCount > 0 && (
            <>
              <Separator />
              <div className="p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="w-full"
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t('notifications.markAllRead')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
