'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { getAlbumTracks } from '@/lib/spotify'
import { SpotifyTrack } from '@/types'
import TrackRow from '@/components/TrackRow'
import { ArrowLeft, Play, Shuffle, Heart, MoreHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AlbumPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuth()
  const [album, setAlbum] = useState<any>(null)
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAlbum = async () => {
      if (!token || !params.id) return

      try {
        setIsLoading(true)
        // For now, we'll create a mock album structure
        // In a real app, you'd fetch the album details from Spotify API
        const mockAlbum = {
          id: params.id,
          name: 'Sample Album',
          artists: [{ name: 'Sample Artist' }],
          images: [{ url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BbGJ1bTwvdGV4dD4KPC9zdmc+' }],
          release_date: '2023',
          total_tracks: 0
        }
        
        setAlbum(mockAlbum)
        
        // Load album tracks
        const tracksData = await getAlbumTracks(params.id as string, token)
        setTracks(tracksData.items || [])
      } catch (error) {
        console.error('Error loading album:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAlbum()
  }, [token, params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Album not found</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-spotify-green text-black px-6 py-2 rounded-full font-semibold hover:bg-green-500 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-b from-spotify-green/20 to-black p-6">
        <div className="flex items-end space-x-6">
          <button
            onClick={() => router.push('/')}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-end space-x-6">
            <img
              src={album.images?.[0]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BbGJ1bTwvdGV4dD4KPC9zdmc+'}
              alt={album.name}
              className="w-48 h-48 rounded-md shadow-2xl"
            />
            
            <div className="flex-1">
              <p className="text-sm text-white mb-2">Album</p>
              <h1 className="text-6xl font-bold text-white mb-4">{album.name}</h1>
              <p className="text-gray-300 text-lg mb-2">
                {album.artists.map((artist: any) => artist.name).join(', ')}
              </p>
              <p className="text-gray-400">
                {album.release_date} • {tracks.length} songs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/50 p-6">
        <div className="flex items-center space-x-4">
          <button className="bg-spotify-green text-black rounded-full p-4 hover:scale-105 transition-transform">
            <Play className="w-6 h-6 ml-1" fill="currentColor" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tracks */}
      <div className="p-6">
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <TrackRow key={track.id} track={track} index={index + 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
