'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, Monitor, Mic, List, Square, Maximize2, ListMusic } from 'lucide-react'
import { SpotifyTrack } from '@/types'

interface PlayerProps {
  currentTrack?: SpotifyTrack | null
  isPlaying?: boolean
  onPlayPause?: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export default function Player({ 
  currentTrack, 
  isPlaying = false, 
  onPlayPause,
  onNext,
  onPrevious 
}: PlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(50)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'off' | 'track' | 'context'>('off')
  const [isLiked, setIsLiked] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (!currentTrack?.preview_url) {
      console.log('Cannot play track - no preview URL available')
      // Still allow the UI to update even if audio can't play
      if (onPlayPause) {
        onPlayPause()
      }
      return
    }
    
    if (onPlayPause) {
      onPlayPause()
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(console.error)
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newTime = (clickX / rect.width) * duration
    
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleRepeat = () => {
    const modes: ('off' | 'track' | 'context')[] = ['off', 'context', 'track']
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  useEffect(() => {
    if (currentTrack?.preview_url) {
      const audio = new Audio(currentTrack.preview_url)
      audioRef.current = audio
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })
      
      audio.addEventListener('ended', () => {
        setCurrentTime(0)
        if (onNext) onNext()
      })
      
      audio.volume = volume / 100
      
      // Auto-play if isPlaying is true
      if (isPlaying) {
        audio.play().catch(console.error)
      }
      
      return () => {
        audio.pause()
        audio.removeEventListener('timeupdate', () => {})
        audio.removeEventListener('loadedmetadata', () => {})
        audio.removeEventListener('ended', () => {})
      }
    } else if (currentTrack && !currentTrack.preview_url) {
      // Track has no preview URL - show message or handle differently
      console.log('Track has no preview URL:', currentTrack.name)
      // Reset audio ref
      audioRef.current = null
      setCurrentTime(0)
      setDuration(0)
    }
  }, [currentTrack, volume, onNext, isPlaying])

  // Handle play/pause when isPlaying state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  if (!currentTrack) {
    return (
      <div className="bg-spotify-card border-t border-gray-800 px-6 py-4 w-full">
        <div className="flex items-center justify-center">
          <p className="text-gray-400 text-sm">No track selected</p>
        </div>
      </div>
    )
  }

  // Debug log to see what track is being passed
  console.log('Player component - currentTrack:', currentTrack)
  console.log('Player component - isPlaying:', isPlaying)
  console.log('Player component - preview_url:', currentTrack?.preview_url)

  return (
    <div className="bg-spotify-card border-t border-gray-800 px-6 py-2 w-full">
      <div className="flex items-center justify-between">
        {/* Current Track Info */}
        <div className="flex items-center space-x-4 w-1/4">
          <div className="w-12 h-12 bg-gray-600 rounded-md flex-shrink-0">
            {currentTrack.album.images[0] && (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album.name}
                className="w-full h-full object-cover rounded-md"
              />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="text-white text-sm font-medium truncate">{currentTrack.name}</h4>
            <p className="text-gray-400 text-sm truncate">
              {currentTrack.artists.map(artist => artist.name).join(', ')}
            </p>
            {!currentTrack.preview_url && (
              <a
                href={currentTrack.external_urls?.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-spotify-green text-xs hover:underline"
              >
                Open in Spotify
              </a>
            )}
          </div>
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`hover:text-white transition-colors ${
              isLiked ? 'text-spotify-green' : 'text-gray-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 w-1/2">
          {/* Control Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsShuffled(!isShuffled)}
              className={`hover:text-white transition-colors ${
                isShuffled ? 'text-spotify-green' : 'text-gray-400'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button 
              onClick={onPrevious}
              className="text-gray-400 hover:text-white"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            <button 
              onClick={handlePlayPause}
              className={`rounded-full p-2 hover:scale-105 transition-transform ${
                currentTrack?.preview_url 
                  ? 'bg-white text-black' 
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!currentTrack?.preview_url}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button 
              onClick={onNext}
              className="text-gray-400 hover:text-white"
            >
              <SkipForward className="w-5 h-5" />
            </button>
            <button 
              onClick={handleRepeat}
              className={`hover:text-white transition-colors ${
                repeatMode !== 'off' ? 'text-spotify-green' : 'text-gray-400'
              }`}
            >
              <Repeat className={`w-5 h-5 ${repeatMode === 'track' ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 w-full">
            <span className="text-gray-400 text-xs">{formatTime(currentTime)}</span>
            <div 
              className="flex-1 bg-gray-600 rounded-full h-1 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-white h-1 rounded-full transition-all" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-gray-400 text-xs">{formatTime(duration)}</span>
          </div>
          
          {/* No Preview Message */}
          {!currentTrack?.preview_url && (
            <div className="text-center">
              <p className="text-gray-400 text-xs">Preview not available for this track</p>
              
            </div>
          )}
        </div>

        {/* Volume and Device Controls */}
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          {/* Lyrics/Mic Button */}
          <button className="text-gray-400 hover:text-white">
            <Mic className="w-5 h-5" />
          </button>
          
          {/* Queue Button */}
          <button className="text-gray-400 hover:text-white">
            <ListMusic className="w-5 h-5" />
          </button>
          
          {/* Device/Connect Button */}
          <button className="text-gray-400 hover:text-white">
            <Monitor className="w-5 h-5" />
          </button>
          
          {/* Volume Controls */}
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 bg-gray-600 rounded-full h-1 appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #1db954 0%, #1db954 ${volume}%, #4a4a4a ${volume}%, #4a4a4a 100%)`
              }}
            />
          </div>
          
          {/* Mini Player Button */}
          <button className="text-gray-400 hover:text-white">
            <Square className="w-4 h-4" />
          </button>
          
          {/* Full Screen Button */}
          <button className="text-gray-400 hover:text-white">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
