'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { SpotifyTrack } from '@/types'

interface PlayerContextType {
  currentTrack: SpotifyTrack | null
  isPlaying: boolean
  currentPlaylist: SpotifyTrack[]
  currentIndex: number
  setCurrentTrack: (track: SpotifyTrack | null) => void
  setIsPlaying: (playing: boolean) => void
  playTrack: (track: SpotifyTrack) => void
  pauseTrack: () => void
  resumeTrack: () => void
  playPlaylist: (tracks: SpotifyTrack[], startIndex?: number) => void
  nextTrack: () => void
  previousTrack: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlaylist, setCurrentPlaylist] = useState<SpotifyTrack[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const playTrack = (track: SpotifyTrack) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const playPlaylist = (tracks: SpotifyTrack[], startIndex: number = 0) => {
    setCurrentPlaylist(tracks)
    setCurrentIndex(startIndex)
    setCurrentTrack(tracks[startIndex])
    setIsPlaying(true)
  }

  const nextTrack = () => {
    if (currentPlaylist.length > 0 && currentIndex < currentPlaylist.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentTrack(currentPlaylist[nextIndex])
    }
  }

  const previousTrack = () => {
    if (currentPlaylist.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      setCurrentTrack(currentPlaylist[prevIndex])
    }
  }

  const pauseTrack = () => {
    setIsPlaying(false)
  }

  const resumeTrack = () => {
    setIsPlaying(true)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentPlaylist,
        currentIndex,
        setCurrentTrack,
        setIsPlaying,
        playTrack,
        pauseTrack,
        resumeTrack,
        playPlaylist,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}

