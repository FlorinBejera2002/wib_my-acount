import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CardSectionHeader } from '@/components/ui/card-icon-header'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useSessions,
  useTerminateAllSessions,
  useTerminateSession
} from '@/hooks/use-sessions'
import { formatDateTime } from '@/lib/utils'
import {
  ChevronDown,
  ChevronUp,
  Globe,
  Loader2,
  Monitor,
  Smartphone
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const VISIBLE_COUNT = 5

function getDeviceIcon(ua: string) {
  const lower = ua.toLowerCase()
  if (
    lower.includes('iphone') ||
    lower.includes('android') ||
    lower.includes('mobile')
  ) {
    return Smartphone
  }
  return Monitor
}

function parseUserAgent(ua: string): string {
  const lower = ua.toLowerCase()

  let browser = ''
  if (lower.includes('edg')) browser = 'Edge'
  else if (lower.includes('opr') || lower.includes('opera')) browser = 'Opera'
  else if (lower.includes('chrome') || lower.includes('chromium'))
    browser = 'Chrome'
  else if (lower.includes('firefox')) browser = 'Firefox'
  else if (lower.includes('safari')) browser = 'Safari'

  let os = ''
  if (lower.includes('windows')) os = 'Windows'
  else if (lower.includes('mac os') || lower.includes('macos')) os = 'macOS'
  else if (lower.includes('linux')) os = 'Linux'
  else if (lower.includes('android')) os = 'Android'
  else if (
    lower.includes('iphone') ||
    lower.includes('ipad') ||
    lower.includes('ios')
  )
    os = 'iOS'

  if (browser && os) return `${browser} — ${os}`
  if (browser) return browser
  if (os) return os
  return ua.length > 40 ? `${ua.slice(0, 40)}…` : ua
}

export function ActiveSessions() {
  const { t } = useTranslation()
  const { data: sessions, isLoading } = useSessions()
  const terminateSession = useTerminateSession()
  const terminateAll = useTerminateAllSessions()
  const [expanded, setExpanded] = useState(false)

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardSectionHeader title="" />
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-lg border border-gray-100 p-3"
            >
              <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-8 w-20 shrink-0" />
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const totalCount = sessions?.length ?? 0
  const hasMore = totalCount > VISIBLE_COUNT
  const visibleSessions = expanded
    ? sessions
    : sessions?.slice(0, VISIBLE_COUNT)

  return (
    <Card className="shadow-sm">
      <CardSectionHeader
        title={t('security.activeSessions')}
        description={t('security.activeSessionsSubtitle')}
        action={
          sessions && sessions.length > 1 ? (
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
          ) : undefined
        }
      />
      <CardContent className="space-y-3">
        {visibleSessions?.map((session) => {
          const DeviceIcon = getDeviceIcon(session.userAgent)
          return (
            <div
              key={session.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-lg border border-gray-100 p-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <DeviceIcon className="h-4 w-4 text-slate-600" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">
                    {parseUserAgent(session.userAgent)}
                  </p>
                  {session.current && (
                    <Badge className="bg-green-100 text-green-800 border-0 text-xs font-medium">
                      {t('security.currentSession')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    IP: {session.ipAddress}
                  </span>
                </div>
                {session.startedAt && (
                  <p className="text-xs text-muted-foreground">
                    {t('security.sessionCreated', {
                      date: formatDateTime(session.startedAt)
                    })}
                  </p>
                )}
                {session.lastActivityAt && (
                  <p className="text-xs text-muted-foreground">
                    {t('security.lastActivity', {
                      date: formatDateTime(session.lastActivityAt)
                    })}
                  </p>
                )}
              </div>
              {!session.current && (
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

        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                {t('common.showLess')}
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                {t('common.showMore')} ({totalCount - VISIBLE_COUNT})
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
