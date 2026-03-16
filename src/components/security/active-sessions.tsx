import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useSessions,
  useTerminateAllSessions,
  useTerminateSession
} from '@/hooks/use-sessions'
import { formatDateTime } from '@/lib/utils'
import { Globe, Loader2, Monitor, Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function getDeviceIcon(deviceInfo: string) {
  const lower = deviceInfo.toLowerCase()
  if (lower.includes('iphone') || lower.includes('android')) {
    return Smartphone
  }
  return Monitor
}

export function ActiveSessions() {
  const { t } = useTranslation()
  const { data: sessions, isLoading } = useSessions()
  const terminateSession = useTerminateSession()
  const terminateAll = useTerminateAllSessions()

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>{t('security.activeSessions')}</CardTitle>
          <CardDescription>
            {t('security.activeSessionsSubtitle')}
          </CardDescription>
        </div>
        {sessions && sessions.length > 1 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => terminateAll.mutate()}
            disabled={terminateAll.isPending}
          >
            {terminateAll.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {t('security.terminateAll')}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {sessions?.map((session) => {
          const DeviceIcon = getDeviceIcon(session.deviceInfo)
          return (
            <div
              key={session.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border p-4"
            >
              <DeviceIcon className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{session.deviceInfo}</p>
                  {session.isCurrent && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0">
                      {t('security.currentSession')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    {session.location}
                  </span>
                  <span>IP: {session.ipAddress}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('security.lastActivity', {
                    date: formatDateTime(session.lastActivity)
                  })}
                </p>
              </div>
              {!session.isCurrent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => terminateSession.mutate(session.id)}
                  disabled={terminateSession.isPending}
                >
                  {t('security.terminate')}
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
