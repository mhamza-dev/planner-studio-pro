import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout, ErrorBoundary, PageLoader } from '@/components/layout/index'

const Dashboard  = lazy(() => import('@/pages/Dashboard'))
const Builder    = lazy(() => import('@/pages/Builder'))
const Templates  = lazy(() => import('@/pages/Templates'))
const Analytics  = lazy(() => import('@/pages/Analytics'))
const Etsy       = lazy(() => import('@/pages/Etsy'))
const Downloads  = lazy(() => import('@/pages/Downloads'))
const Settings   = lazy(() => import('@/pages/Settings'))

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader/>}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout/>,
    children: [
      { index: true,          element: <Wrap><Dashboard/></Wrap> },
      { path: 'builder',      element: <Wrap><Builder/></Wrap> },
      { path: 'templates',    element: <Wrap><Templates/></Wrap> },
      { path: 'analytics',    element: <Wrap><Analytics/></Wrap> },
      { path: 'etsy',         element: <Wrap><Etsy/></Wrap> },
      { path: 'downloads',    element: <Wrap><Downloads/></Wrap> },
      { path: 'settings',     element: <Wrap><Settings/></Wrap> },
    ],
  },
])

export const AppRouter: React.FC = () => <RouterProvider router={router}/>
