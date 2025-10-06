'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { spotifyApi } from '@/lib/spotify'
import { SpotifyTrack } from '@/types'
import { Heart, Plus, Share, MoreHorizontal } from 'lucide-react'

interface ArtistDetailsProps {
  currentTrack?: SpotifyTrack | null
}

export default function ArtistDetails({ currentTrack }: ArtistDetailsProps) {
  const [artist, setArtist] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const { token } = useAuth()

  useEffect(() => {
    const loadArtistDetails = async () => {
      if (!currentTrack?.artists?.[0]?.id || !token) return

      try {
        setIsLoading(true)
        const artistData = await spotifyApi(`/artists/${currentTrack.artists[0].id}`, token)
        setArtist(artistData)
      } catch (error) {
        console.error('Error loading artist details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadArtistDetails()
  }, [currentTrack, token])

  if (!currentTrack || !artist) {
    return (
      <div className="w-80 bg-spotify-card p-6">
        <div className="text-center">
          <p className="text-gray-400 text-sm">No artist information available</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-80 bg-spotify-card p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-spotify-green"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-spotify-card p-6 h-full overflow-y-auto">
      <div className="space-y-6">
        {/* Artist Image */}
        <div className="text-center">
          <img
            src={artist.images?.[0]?.url || '/placeholder-artist.png'}
            alt={artist.name}
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <h2 className="text-xl font-bold text-white mb-2">{artist.name}</h2>
          <p className="text-gray-400 text-sm">
            {artist.followers?.total?.toLocaleString()} followers
          </p>
        </div>

        {/* Artist Actions */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              isFollowing
                ? 'bg-gray-600 text-white'
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
          <button className="text-gray-400 hover:text-white">
            <Heart className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Plus className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Share className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Artist Genres */}
        {artist.genres && artist.genres.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-2">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {artist.genres.slice(0, 3).map((genre: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Popularity */}
        <div>
          <h3 className="text-white font-semibold mb-2">Popularity</h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-700 rounded-full h-2">
              <div
                className="bg-spotify-green h-2 rounded-full"
                style={{ width: `${artist.popularity}%` }}
              />
            </div>
            <span className="text-gray-400 text-sm">{artist.popularity}%</span>
          </div>
        </div>

        {/* Current Track Info */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-white font-semibold mb-2">Now Playing</h3>
          <div className="flex items-center space-x-3">
            <img
              src={currentTrack.album.images?.[0]?.url || '/placeholder-album.png'}
              alt={currentTrack.album.name}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {currentTrack.name}
              </p>
              <p className="text-gray-400 text-xs truncate">
                {currentTrack.album.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
