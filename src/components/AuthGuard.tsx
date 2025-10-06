'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSpotifyToken, isTokenExpired } from '@/lib/auth'
import Layout from './Layout'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Pages that don't require authentication
  const publicPages = ['/login', '/callback']
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    const checkAuth = () => {
      // If it's a public page, allow access
      if (isPublicPage) {
        setIsAuthenticated(true)
        setIsLoading(false)
        return
      }

      // Check if user has valid token
      const token = getSpotifyToken()
      console.log('AuthGuard - Token:', token)
      console.log('AuthGuard - Is expired:', token ? isTokenExpired(token) : 'No token')
      
      if (token && !isTokenExpired(token)) {
        console.log('AuthGuard - User is authenticated')
        setIsAuthenticated(true)
      } else {
        console.log('AuthGuard - No valid token, redirecting to login')
        // No valid token, redirect to login
        router.push('/login')
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router, isPublicPage])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-spotify-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated && !isPublicPage) {
    return null // Will redirect to login
  }

  // For public pages (login, callback), render children directly
  if (isPublicPage) {
    return <>{children}</>
  }

  // For authenticated pages, wrap with Layout
  return (
    <Layout>
      {children}
    </Layout>
  )
}
