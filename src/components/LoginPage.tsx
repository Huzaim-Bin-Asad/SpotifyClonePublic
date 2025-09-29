'use client'

import { useState } from 'react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSpotifyLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/spotify')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get auth URL')
      }
      
      window.location.href = data.authUrl
    } catch (error) {
      console.error('Error getting auth URL:', error)
      alert('Error connecting to Spotify. Please check your credentials.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <img
              src="/spotify.png"
              alt="Spotify"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Spotify Clone</h1>
          <p className="text-gray-300 text-lg">Connect to your music world</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-gray-300">Sign in to continue to your music</p>
          </div>

          {/* Spotify Login Button */}
          <button
            onClick={handleSpotifyLogin}
            disabled={isLoading}
            className="w-full bg-spotify-green hover:bg-green-500 text-black font-bold py-4 px-6 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <img
                  src="/spotify.png"
                  alt="Spotify"
                  className="w-6 h-6"
                />
                <span>Continue with Spotify</span>
              </>
            )}
          </button>

          {/* Features List */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
              <span>Access your playlists and music</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
              <span>Search millions of songs</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
              <span>Get personalized recommendations</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-2 h-2 bg-spotify-green rounded-full"></div>
              <span>Play 30-second previews</span>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Don't have Spotify? 
            <a 
              href="https://www.spotify.com/signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-spotify-green ml-1 underline"
            >
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

