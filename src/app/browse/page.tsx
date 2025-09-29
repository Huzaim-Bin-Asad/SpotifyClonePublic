'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'
import { getLikedSongs, getUserPlaylists, getRecentlyPlayed } from '@/lib/spotify'
import { SpotifyTrack, SpotifyPlaylist } from '@/types'
import TrackRow from '@/components/TrackRow'
import PlaylistCard from '@/components/PlaylistCard'
import { usePlayer } from '@/lib/player'

export default function BrowsePage() {
  const [likedSongs, setLikedSongs] = useState<SpotifyTrack[]>([])
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([])
  const [recentTracks, setRecentTracks] = useState<SpotifyTrack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { token } = useAuth()
  const { playPlaylist } = usePlayer()

  useEffect(() => {
    const loadBrowseData = async () => {
      if (!token) return

      try {
        setIsLoading(true)
        const [likedSongsData, playlistsData, recentTracksData] = await Promise.all([
          getLikedSongs(token).catch(() => ({ items: [] })),
          getUserPlaylists(token).catch(() => ({ items: [] })),
          getRecentlyPlayed(token).catch(() => ({ items: [] }))
        ])

        setLikedSongs(likedSongsData.items?.map((item: any) => item.track) || [])
        setPlaylists(playlistsData.items || [])
        setRecentTracks(recentTracksData.items?.map((item: any) => item.track) || [])
      } catch (error) {
        console.error('Error loading browse data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadBrowseData()
  }, [token])

  const handlePlayPlaylist = (tracks: SpotifyTrack[], startIndex: number = 0) => {
    playPlaylist(tracks, startIndex)
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
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
      <h1 className="text-3xl font-bold text-white mb-8">Browse</h1>

      {/* Liked Songs */}
      {likedSongs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Liked Songs</h2>
          <div className="space-y-1">
            {likedSongs.slice(0, 10).map((track, index) => (
              <TrackRow key={track.id} track={track} index={index + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Your Playlists */}
      {playlists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Your Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {playlists.slice(0, 12).map((playlist) => (
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

      {/* Recently Played */}
      {recentTracks.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recently Played</h2>
          <div className="space-y-1">
            {recentTracks.slice(0, 10).map((track, index) => (
              <TrackRow key={track.id} track={track} index={index + 1} />
            ))}
          </div>
        </section>
      )}

      {/* Mixed Content */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Mixed for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Mix liked songs and playlists randomly */}
          {[...likedSongs.slice(0, 6), ...playlists.slice(0, 6)].map((item, index) => (
            <div key={index} className="bg-spotify-card rounded-lg p-4 hover:bg-spotify-hover transition-colors">
              <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-md mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  {item.name ? item.name.charAt(0) : '?'}
                </span>
              </div>
              <h3 className="text-white font-medium truncate mb-1">
                {item.name || 'Unknown'}
              </h3>
              <p className="text-gray-400 text-sm truncate">
                {item.type === 'playlist' ? 'Playlist' : 'Track'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
