import { AppLayout } from '@/components/layout/app-layout'
import { ProfileLayout } from '@/components/layout/profile-layout'
import { ProtectedRoute } from '@/components/layout/protected-route'
import DashboardPage from '@/pages/dashboard'
import ForgotPasswordPage from '@/pages/forgot-password'
import LoginPage from '@/pages/login'
import NotFoundPage from '@/pages/not-found'
import RegisterPage from '@/pages/register'
import PoliciesPage from '@/pages/policies'
import PolicyDetailPage from '@/pages/policy-detail'
import ProfilePage from '@/pages/profile'
import QuoteDetailPage from '@/pages/quote-detail'
import QuotesPage from '@/pages/quotes'
import SecurityPage from '@/pages/security'
import SettingsPage from '@/pages/settings'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import NotificationsPage from './pages/notifications'
import RemindersPage from './pages/reminders'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <Navigate to="/dashboard" replace={true} />
          },
          {
            path: '/dashboard',
            element: <DashboardPage />
          },
          {
            path: '/quotes',
            element: <QuotesPage />
          },
          {
            path: '/quotes/:id',
            element: <QuoteDetailPage />
          },
          {
            path: '/policies',
            element: <PoliciesPage />
          },
          {
            path: '/policies/:id',
            element: <PolicyDetailPage />
          },
          {
            path: '/notifications',
            element: <NotificationsPage />
          },
          {
            path: '/reminders',
            element: <RemindersPage />
          },
          {
            path: '/profile',
            element: <ProfileLayout />,
            children: [
              {
                index: true,
                element: <ProfilePage />
              },
              {
                path: 'security',
                element: <SecurityPage />
              },
              {
                path: 'settings',
                element: <SettingsPage />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
])
