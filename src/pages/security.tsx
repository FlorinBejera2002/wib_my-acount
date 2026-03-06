import { ActiveSessions } from '@/components/security/active-sessions'
import { ChangePasswordForm } from '@/components/security/change-password-form'
import { LoginHistory } from '@/components/security/login-history'

export default function SecurityPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <ChangePasswordForm />
        <LoginHistory />
      </div>
      <ActiveSessions />
    </div>
  )
}
