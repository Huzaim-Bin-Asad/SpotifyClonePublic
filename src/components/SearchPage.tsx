'use client'

import { useState, useEffect } from 'react'
import { Search, Play, Pause, Heart, Clock } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { usePlayer } from '@/lib/player'
import { searchAll, searchTracks, searchAlbums, searchArtists } from '@/lib/spotify'
import { SpotifyTrack, SpotifyAlbum, SpotifyArtist, SpotifyPlaylist } from '@/types'
import { useRouter } from 'next/navigation'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { token } = useAuth()
  const { playTrack, currentTrack } = usePlayer()
  const router = useRouter()

  const categories = [
    { id: 'All', name: 'All', color: 'bg-gray-600' },
    { id: 'Tracks', name: 'Songs', color: 'bg-pink-500' },
    { id: 'Albums', name: 'Albums', color: 'bg-purple-500' },
    { id: 'Artists', name: 'Artists', color: 'bg-blue-500' },
    { id: 'Playlists', name: 'Playlists', color: 'bg-green-500' },
  ]

  const browseCategories = [
    { name: 'Made For You', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: 'Recently Played', color: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { name: 'Liked Songs', color: 'bg-gradient-to-br from-green-500 to-emerald-500' },
    { name: 'Chill', color: 'bg-gradient-to-br from-orange-500 to-red-500' },
    { name: 'Workout', color: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
    { name: 'Party', color: 'bg-gradient-to-br from-pink-500 to-purple-500' },
    { name: 'Sleep', color: 'bg-gradient-to-br from-indigo-500 to-blue-500' },
    { name: 'Focus', color: 'bg-gradient-to-br from-teal-500 to-green-500' },
    { name: 'Mood', color: 'bg-gradient-to-br from-rose-500 to-pink-500' },
    { name: 'Pop', color: 'bg-gradient-to-br from-cyan-500 to-blue-500' },
    { name: 'Rock', color: 'bg-gradient-to-br from-gray-500 to-gray-700' },
    { name: 'Hip-Hop', color: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
  ]

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSearch = async (query: string) => {
    if (!query.trim() || !token) return

    setIsLoading(true)
    try {
      let results
      switch (activeFilter) {
        case 'Tracks':
          results = await searchTracks(query, token)
          break
        case 'Albums':
          results = await searchAlbums(query, token)
          break
        case 'Artists':
          results = await searchArtists(query, token)
          break
        default:
          results = await searchAll(query, token)
      }
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlayPreview = (track: SpotifyTrack) => {
    if (currentTrack?.id === track.id) {
      // Track is already playing, toggle play/pause handled by global player
      return
    }
    
    playTrack(track)
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery)
      } else {
        setSearchResults(null)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, activeFilter, token])

  const renderSearchResults = () => {
    if (!searchResults) return null

    const { tracks, albums, artists, playlists } = searchResults

    return (
      <div className="space-y-8">
        {/* Tracks */}
        {tracks?.items?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
            <div className="space-y-2">
              {tracks.items.map((track: SpotifyTrack) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 p-2 rounded-lg hover:bg-spotify-hover group"
                >
                  <div className="w-12 h-12 bg-gray-600 rounded-md flex-shrink-0 relative">
                    {track.album.images?.[0] && (
                      <img
                        src={track.album.images[0].url}
                        alt={track.album.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    )}
                    <button
                      onClick={() => track.preview_url && handlePlayPreview(track)}
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
                  <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Albums */}
        {albums?.items?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Albums</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {albums.items.map((album: SpotifyAlbum) => (
                <div
                  key={album.id}
                  className="bg-spotify-card rounded-lg p-4 hover:bg-spotify-hover transition-colors cursor-pointer group"
                  onClick={() => router.push(`/album/${album.id}`)}
                >
                  <div className="relative mb-4">
                    <img
                      src={album.images?.[0]?.url || '/placeholder-album.png'}
                      alt={album.name}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <button 
                      className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Implement play album functionality
                        console.log('Play album:', album.name)
                      }}
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-white font-medium truncate mb-1">{album.name}</h3>
                  <p className="text-gray-400 text-sm truncate">
                    {album.artists.map(artist => artist.name).join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Artists */}
        {artists?.items?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Artists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {artists.items.map((artist: SpotifyArtist) => (
                <div
                  key={artist.id}
                  className="bg-spotify-card rounded-lg p-4 hover:bg-spotify-hover transition-colors cursor-pointer group text-center"
                >
                  <div className="relative mb-4">
                    <img
                      src={artist.images?.[0]?.url || '/placeholder-artist.png'}
                      alt={artist.name}
                      className="w-full aspect-square object-cover rounded-full mx-auto"
                    />
                    <button className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-white font-medium truncate">{artist.name}</h3>
                  <p className="text-gray-400 text-sm">Artist</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Playlists */}
        {playlists?.items?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Playlists</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {playlists.items.map((playlist: SpotifyPlaylist) => (
                <div
                  key={playlist.id}
                  className="bg-spotify-card rounded-lg p-4 hover:bg-spotify-hover transition-colors cursor-pointer group"
                >
                  <div className="relative mb-4">
                    <img
                      src={playlist?.images?.[0]?.url || '/placeholder-playlist.png'}
                      alt={playlist?.name || 'Playlist'}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                    <button className="absolute bottom-2 right-2 bg-spotify-green text-black rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105">
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-white font-medium truncate mb-1">{playlist?.name || 'Playlist'}</h3>
                  <p className="text-gray-400 text-sm truncate">
                    By {playlist?.owner?.display_name || 'Unknown'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
        
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-black rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveFilter(category.id)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === category.id
                ? 'bg-white text-black'
                : 'bg-spotify-hover text-white hover:bg-gray-600'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Search Results or Browse Categories */}
      {searchQuery.trim() ? (
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-green"></div>
            </div>
          ) : (
            renderSearchResults()
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {browseCategories.map((category, index) => (
              <div
                key={index}
                className={`${category.color} rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform`}
              >
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
