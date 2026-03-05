import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/components/layout/protected-route";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import QuotesPage from "@/pages/quotes";
import QuoteDetailPage from "@/pages/quote-detail";
import PoliciesPage from "@/pages/policies";
import PolicyDetailPage from "@/pages/policy-detail";
import ProfilePage from "@/pages/profile";
import SecurityPage from "@/pages/security";
import SettingsPage from "@/pages/settings";
import NotFoundPage from "@/pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/quotes",
            element: <QuotesPage />,
          },
          {
            path: "/quotes/:id",
            element: <QuoteDetailPage />,
          },
          {
            path: "/policies",
            element: <PoliciesPage />,
          },
          {
            path: "/policies/:id",
            element: <PolicyDetailPage />,
          },
          {
            path: "/profile",
            element: <ProfilePage />,
          },
          {
            path: "/security",
            element: <SecurityPage />,
          },
          {
            path: "/settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
