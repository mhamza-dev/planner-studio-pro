import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { LoadingSpinner } from '@/components/ui/Misc'

const DashboardPage = lazy(() => import('@/pages/Dashboard'))
const BuilderPage = lazy(() => import('@/pages/Builder'))
const TemplatesPage = lazy(() => import('@/pages/Templates'))
const DownloadsPage = lazy(() => import('@/pages/Downloads'))
const SettingsPage = lazy(() => import('@/pages/Settings'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary><div className="p-8 text-center text-secondary">Page not found</div></ErrorBoundary>,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <DashboardPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'builder',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <BuilderPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'templates',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <TemplatesPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'downloads',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <DownloadsPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: 'settings',
        element: (
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <SettingsPage />
            </Suspense>
          </ErrorBoundary>
        ),
      },
    ],
  },
])

export const AppRouter: React.FC = () => <RouterProvider router={router} />
