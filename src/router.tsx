import { AppLayout } from '@/components/layout/app-layout'
import { ProfileLayout } from '@/components/layout/profile-layout'
import { ProtectedRoute } from '@/components/layout/protected-route'
import DashboardPage from '@/pages/dashboard'
import ForgotPasswordPage from '@/pages/forgot-password'
import LoginPage from '@/pages/login'
import NotFoundPage from '@/pages/not-found'
import PoliciesPage from '@/pages/policies'
import ProfilePage from '@/pages/profile'
import QuotesPage from '@/pages/quotes'
import RegisterPage from '@/pages/register'
import SecurityPage from '@/pages/security'
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
            path: '/policies',
            element: <PoliciesPage />
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
