'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

export default function CallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const { login } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        if (error) {
          setError('Authentication failed. Please try again.')
          setStatus('error')
          return
        }

        if (!code) {
          setError('No authorization code received.')
          setStatus('error')
          return
        }

        // Exchange authorization code for real access token
        const tokenResponse = await fetch('/api/spotify/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code })
        })

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          setError(`Token exchange failed: ${errorData.error}`)
          setStatus('error')
          return
        }

        const tokenData = await tokenResponse.json()
        console.log('Token exchange response:', tokenData)
        
        // Use the auth context to login with real token
        login(tokenData)
        
        setStatus('success')
        
        // Redirect to home page after successful auth
        setTimeout(() => {
          router.push('/')
        }, 2000)

      } catch (err) {
        setError('An error occurred during authentication.')
        setStatus('error')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-black bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-white mb-2">Connecting to Spotify</h2>
              <p className="text-green-100">Please wait while we authenticate your account...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-spotify-green rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
              <p className="text-green-100">You're now connected to Spotify. Redirecting...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Authentication Failed</h2>
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={() => router.push('/login')}
                className="bg-spotify-green hover:bg-green-500 text-black font-bold py-2 px-4 rounded-full transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

