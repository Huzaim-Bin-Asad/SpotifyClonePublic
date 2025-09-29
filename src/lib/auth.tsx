// Authentication utilities for Spotify integration
'use client'

import { useState, useEffect, createContext, useContext, ReactNode } from 'react'

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: Array<{ url: string; height: number; width: number }>
  country: string
  followers: { total: number }
}

export interface SpotifyToken {
  access_token: string
  token_type: string
  expires_in: number
  expires_at?: number // Timestamp when token expires
  refresh_token?: string
  scope: string
}

interface AuthContextType {
  token: string | null
  user: SpotifyUser | null
  isAuthenticated: boolean
  login: (token: SpotifyToken) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<SpotifyUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for existing token on mount
    const existingToken = getSpotifyToken()
    if (existingToken && !isTokenExpired(existingToken)) {
      setToken(existingToken.access_token)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (tokenData: SpotifyToken) => {
    setSpotifyToken(tokenData)
    setToken(tokenData.access_token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    clearSpotifyToken()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Store token in localStorage (in production, use secure httpOnly cookies)
export const setSpotifyToken = (token: SpotifyToken) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('spotify_token', JSON.stringify(token))
  }
}

export const getSpotifyToken = (): SpotifyToken | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('spotify_token')
    return token ? JSON.parse(token) : null
  }
  return null
}

export const clearSpotifyToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('spotify_token')
  }
}

// Check if token is expired
export const isTokenExpired = (token: SpotifyToken): boolean => {
  const now = Date.now()
  
  // If we have an expiration timestamp, use it
  if (token.expires_at) {
    return now > token.expires_at
  }
  
  // Fallback: assume token is valid for the duration specified
  // This is not ideal but works for demo purposes
  return false
}

// Refresh token (you'll need to implement this with your backend)
export const refreshSpotifyToken = async (refreshToken: string): Promise<SpotifyToken> => {
  // This should be called from your backend for security
  // Never expose client secret in frontend code
  const response = await fetch('/api/spotify/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  return response.json()
}
