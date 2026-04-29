import type { Reminder } from '@/api/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Bell, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function getExpiryDate(reminder: Reminder): string {
  if (reminder.note) {
    try {
      const parsed = JSON.parse(reminder.note)
      if (parsed.expiryDate) return parsed.expiryDate
    } catch {
      // fallback
    }
  }
  return reminder.remindAt
}

interface UpcomingRemindersProps {
  reminders: Reminder[]
}

export function UpcomingReminders({ reminders }: UpcomingRemindersProps) {
  const { t, i18n } = useTranslation()

  if (reminders.length === 0) return null

  return (
    <Card className="shadow-sm overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          {t('dashboard.upcomingReminders')}
        </CardTitle>
        <Link
          to="/reminders"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {t('common.viewAll')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 grid-cols-1 lg:grid-cols-2">
          {reminders.map((reminder) => {
            const expiryDate = new Date(getExpiryDate(reminder))
            const daysLeft = Math.ceil(
              (expiryDate.getTime() - Date.now()) / 86400000
            )

            return (
              <div
                key={reminder.id}
                className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/30 p-3 transition-all hover:bg-slate-50/50 hover:border-slate-300"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                  <Bell className="h-4 w-4 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {reminder.title}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>
                      {expiryDate.toLocaleDateString(i18n.language, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    {daysLeft >= 0 && (
                      <span className="ml-1 text-slate-700 font-medium">
                        ({t('dashboard.reminderDaysLeft', { days: daysLeft })})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
