// Spotify API Response Types
export interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  duration_ms: number
  preview_url: string | null
  external_urls: {
    spotify: string
  }
  is_playable?: boolean
  is_local?: boolean
}

export interface SpotifyAlbum {
  id: string
  name: string
  artists: SpotifyArtist[]
  images: SpotifyImage[]
  release_date: string
  total_tracks: number
  external_urls: {
    spotify: string
  }
}

export interface SpotifyArtist {
  id: string
  name: string
  images: SpotifyImage[]
  followers: {
    total: number
  }
  genres: string[]
  external_urls: {
    spotify: string
  }
}

export interface SpotifyPlaylist {
  id: string
  name: string
  description: string
  images: SpotifyImage[]
  owner: {
    display_name: string
  }
  tracks: {
    total: number
  }
  external_urls: {
    spotify: string
  }
}

export interface SpotifyImage {
  url: string
  height: number
  width: number
}

export interface SpotifyUser {
  id: string
  display_name: string
  email: string
  images: SpotifyImage[]
  followers: {
    total: number
  }
  external_urls: {
    spotify: string
  }
}

// Legacy interfaces for backward compatibility
export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: string
  image: string
  audioUrl?: string
  isPlaying?: boolean
}

export interface Playlist {
  id: string
  name: string
  description: string
  image: string
  type: string
  tracks?: Track[]
  owner?: string
  followers?: number
}

export interface Artist {
  id: string
  name: string
  image: string
  followers: number
  verified: boolean
  genres: string[]
  topTracks: Track[]
  albums: Playlist[]
}

export interface User {
  id: string
  name: string
  email: string
  image: string
  followers: number
  following: number
}
