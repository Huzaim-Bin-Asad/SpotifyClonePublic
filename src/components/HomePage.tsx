'use client'

import { useState, useEffect } from 'react'
import { Play, Pause, Heart } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { usePlayer } from '@/lib/player'
import { getUserPlaylists, getUserTopTracks, getRecentlyPlayed, getDailyMix, getLikedSongs } from '@/lib/spotify'
import { SpotifyPlaylist, SpotifyTrack } from '@/types'
import PlaylistCard from './PlaylistCard'

export default function HomePage() {
  const [greeting, setGreeting] = useState('Good evening')
  const [userPlaylists, setUserPlaylists] = useState<SpotifyPlaylist[]>([])
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([])
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([])
  const [dailyMixTracks, setDailyMixTracks] = useState<SpotifyTrack[]>([])
  const [likedSongs, setLikedSongs] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()
  const { playTrack, playPlaylist, currentTrack } = usePlayer()

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours()
      if (hour < 12) return 'Good morning'
      if (hour < 18) return 'Good afternoon'
      return 'Good evening'
    }
    setGreeting(getGreeting())
  }, [])

  useEffect(() => {
    const loadUserData = async () => {
      if (!token) return

      setIsLoading(true)
      try {
        const [playlistsData, topTracksData, recentTracksData, dailyMixData, likedSongsData] = await Promise.all([
          getUserPlaylists(token),
          getUserTopTracks(token, 'medium_term'),
          getRecentlyPlayed(token),
          getDailyMix(token).catch(() => ({ tracks: [] })), // Fallback if daily mix fails
          getLikedSongs(token).catch(() => ({ items: [] })) // Fallback if liked songs fails
        ])

        setUserPlaylists(playlistsData.items || [])
        setTopTracks(topTracksData.items || [])
        setRecentTracks(recentTracksData.items?.map((item: any) => item.track) || [])
        setDailyMixTracks(dailyMixData.tracks || [])
        setLikedSongs(likedSongsData.items?.map((item: any) => item.track) || [])
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [token])

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handlePlayPreview = (track: SpotifyTrack) => {
    console.log('handlePlayPreview called with track:', track)
    console.log('Track preview_url:', track.preview_url)
    
    if (currentTrack?.id === track.id) {
      // Track is already playing, toggle play/pause handled by global player
      return
    }
    
    // Always try to play the track, even without preview URL
    // The Player component will handle the preview URL check
    console.log('Playing track:', track.name)
    playTrack(track)
  }

  const handlePlayPlaylist = (tracks: SpotifyTrack[], startIndex: number = 0) => {
    playPlaylist(tracks, startIndex)
  }

  const renderTrackList = (tracks: SpotifyTrack[], title: string) => {
    if (!tracks.length) return null

    return (
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
        <div className="space-y-2">
          {tracks.slice(0, 6).map((track, index) => (
            <div
              key={`${title}-${track.id}-${index}`}
              className="flex items-center space-x-4 p-2 rounded-lg hover:bg-spotify-hover group cursor-pointer"
              onClick={() => handlePlayPreview(track)}
            >
              <div className="w-12 h-12 bg-gray-600 rounded-md flex-shrink-0 relative">
                {track.album.images && track.album.images.length > 0 ? (
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 rounded-md flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayPreview(track)
                  }}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {currentTrack?.id === track.id ? (
                    <Pause className="w-4 h-4 text-white" />
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{track.name}</h3>
                <p className="text-gray-400 text-sm truncate">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
              <div className="text-gray-400 text-sm">
                {formatDuration(track.duration_ms)}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Implement like/unlike functionality
                }}
                className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {greeting}
        </h1>
      </div>

      {/* Daily Mix */}
      {renderTrackList(dailyMixTracks, 'Made For You')}

      {/* Liked Songs */}
      {renderTrackList(likedSongs, 'Liked Songs')}

      {/* Top Tracks */}
      {renderTrackList(topTracks, 'Your Top Tracks')}

      {/* Recently Played Tracks */}
      {renderTrackList(recentTracks, 'Recently Played')}

      {/* Your Playlists */}
      {userPlaylists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {userPlaylists.slice(0, 6).map((playlist) => (
              <PlaylistCard 
                key={playlist.id} 
                playlist={{
                  id: playlist.id,
                  name: playlist.name,
                  description: playlist.description,
                  image: playlist.images && playlist.images.length > 0 ? playlist.images[0].url : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QbGF5bGlzdDwvdGV4dD4KPC9zdmc+',
                  type: 'playlist',
                  owner: playlist.owner.display_name
                }} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Made For You Section - Dynamic Daily Mix Playlists */}
      {dailyMixTracks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Made For You</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[
              {
                id: 'daily-mix-1',
                name: 'Daily Mix 1',
                description: 'Made for you',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EYWlseTwvdGV4dD4KPC9zdmc+',
                type: 'playlist'
              },
              {
                id: 'daily-mix-2',
                name: 'Daily Mix 2',
                description: 'Made for you',
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+CjxwYXRoIGQ9Ik03NSA0MEM4NS4yODQzIDQwIDkzIDQ3LjcxNTcgOTMgNThWOTJDOTMgMTAyLjI4NCA4NS4yODQzIDExMCA3NSAxMTBDNjQuNzE1NyAxMTAgNTcgMTAyLjI4NCA1NyA5MlY1OEM1NyA0Ny43MTU3IDY0LjcxNTcgNDAgNzUgNDBaIiBmaWxsPSIjMWQxZDFkIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EYWlseTwvdGV4dD4KPC9zdmc+',
                type: 'playlist'
              }
            ].map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
