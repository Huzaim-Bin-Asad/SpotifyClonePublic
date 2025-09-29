// Spotify Web API Integration
const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || 'fe6d3691a9da40da85cfb30b98b85f3d'
const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || 'https://huzaim-spotify.vercel.app/callback'

// Spotify API endpoints
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1'

// Authentication
export const getSpotifyAuthUrl = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-top-read',
    'user-read-recently-played'
  ].join(' ')

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: scopes,
  })

  return `https://accounts.spotify.com/authorize?${params.toString()}`
}

// API Helper
export const spotifyApi = async (endpoint: string, token: string) => {
  const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`)
  }

  return response.json()
}

// Search tracks
export const searchTracks = async (query: string, token: string) => {
  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: '20',
  })

  return spotifyApi(`/search?${params.toString()}`, token)
}

// Get user's playlists
export const getUserPlaylists = async (token: string) => {
  return spotifyApi('/me/playlists', token)
}

// Get user's top tracks
export const getUserTopTracks = async (token: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term') => {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: '20',
  })

  return spotifyApi(`/me/top/tracks?${params.toString()}`, token)
}

// Get recently played tracks
export const getRecentlyPlayed = async (token: string) => {
  return spotifyApi('/me/player/recently-played?limit=20', token)
}

// Get track features (audio analysis)
export const getTrackFeatures = async (trackId: string, token: string) => {
  return spotifyApi(`/audio-features/${trackId}`, token)
}

// Get recommendations
export const getRecommendations = async (seedTracks: string[], token: string) => {
  try {
    // Ensure we have valid seed tracks
    if (!seedTracks || seedTracks.length === 0) {
      throw new Error('No seed tracks provided')
    }

    // Limit to 5 seed tracks as per Spotify API requirements
    const validSeedTracks = seedTracks.slice(0, 5)
    
    const params = new URLSearchParams({
      seed_tracks: validSeedTracks.join(','),
      limit: '20',
      market: 'US' // Add market parameter
    })

    return spotifyApi(`/recommendations?${params.toString()}`, token)
  } catch (error) {
    console.error('Error getting recommendations:', error)
    // Return empty result instead of throwing
    return { tracks: [] }
  }
}

// Search all content types
export const searchAll = async (query: string, token: string) => {
  const params = new URLSearchParams({
    q: query,
    type: 'track,album,artist,playlist',
    limit: '20',
  })

  return spotifyApi(`/search?${params.toString()}`, token)
}

// Search albums
export const searchAlbums = async (query: string, token: string) => {
  const params = new URLSearchParams({
    q: query,
    type: 'album',
    limit: '20',
  })

  return spotifyApi(`/search?${params.toString()}`, token)
}

// Search artists
export const searchArtists = async (query: string, token: string) => {
  const params = new URLSearchParams({
    q: query,
    type: 'artist',
    limit: '20',
  })

  return spotifyApi(`/search?${params.toString()}`, token)
}

// Get playlist tracks
export const getPlaylistTracks = async (playlistId: string, token: string) => {
  return spotifyApi(`/playlists/${playlistId}/tracks`, token)
}

// Get album tracks
export const getAlbumTracks = async (albumId: string, token: string) => {
  return spotifyApi(`/albums/${albumId}/tracks`, token)
}

// Get artist's top tracks
export const getArtistTopTracks = async (artistId: string, token: string) => {
  return spotifyApi(`/artists/${artistId}/top-tracks?market=US`, token)
}

// Get user's liked songs
export const getLikedSongs = async (token: string) => {
  return spotifyApi('/me/tracks?limit=50', token)
}

// Get user's daily mix (recommendations based on user's listening history)
export const getDailyMix = async (token: string) => {
  try {
    // Get user's top tracks for seeds
    const topTracks = await getUserTopTracks(token, 'medium_term')
    const seedTracks = topTracks.items?.slice(0, 5).map((track: any) => track.id) || []
    
    if (seedTracks.length === 0) {
      // Fallback to recently played tracks
      const recentTracks = await getRecentlyPlayed(token)
      const recentTrackIds = recentTracks.items?.slice(0, 5).map((item: any) => item.track.id) || []
      seedTracks.push(...recentTrackIds)
    }
    
    if (seedTracks.length === 0) {
      // If no user data available, return empty result instead of throwing error
      return { tracks: [] }
    }
    
    // Ensure we have at least 1 seed track but no more than 5
    const validSeedTracks = seedTracks.slice(0, 5)
    
    if (validSeedTracks.length === 0) {
      return { tracks: [] }
    }
    
    return getRecommendations(validSeedTracks, token)
  } catch (error) {
    console.error('Error getting daily mix:', error)
    // Return empty result instead of throwing error
    return { tracks: [] }
  }
}
