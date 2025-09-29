'use client'

import { useState } from 'react'
import { Play, Pause, Heart, MoreHorizontal } from 'lucide-react'
import { SpotifyTrack } from '@/types'
import { usePlayer } from '@/lib/player'

interface TrackRowProps {
  track: SpotifyTrack
  index: number
  onPlay?: (track: SpotifyTrack) => void
}

export default function TrackRow({ track, index, onPlay }: TrackRowProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { playTrack, currentTrack } = usePlayer()

  const handlePlay = () => {
    if (onPlay) {
      onPlay(track)
    } else {
      playTrack(track)
    }
  }

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isCurrentlyPlaying = currentTrack?.id === track.id

  return (
    <div
      className={`flex items-center px-4 py-2 rounded-md group hover:bg-spotify-hover transition-colors ${
        isHovered ? 'bg-spotify-hover' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Track Number / Play Button */}
      <div className="w-8 flex justify-center">
        {isHovered || isCurrentlyPlaying ? (
          <button
            onClick={handlePlay}
            className="text-white hover:text-spotify-green transition-colors"
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="text-gray-400 text-sm">{index + 1}</span>
        )}
      </div>

      {/* Track Info */}
      <div className="flex items-center flex-1 min-w-0">
        {track.album.images[0] && (
          <img
            src={track.album.images[0].url}
            alt={track.album.name}
            className="w-10 h-10 rounded mr-3 flex-shrink-0"
          />
        )}
        <div className="min-w-0 flex-1">
          <h4 className={`text-sm font-medium truncate ${
            isCurrentlyPlaying ? 'text-spotify-green' : 'text-white'
          }`}>
            {track.name}
          </h4>
          <p className="text-gray-400 text-sm truncate">
            {track.artists.map(artist => artist.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Album */}
      <div className="hidden md:block w-1/4 min-w-0">
        <p className="text-gray-400 text-sm truncate hover:text-white cursor-pointer">
          {track.album.name}
        </p>
      </div>

      {/* Date Added */}
      <div className="hidden lg:block w-32 min-w-0">
        <p className="text-gray-400 text-sm">
          2 days ago
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`text-gray-400 hover:text-white transition-colors ${
            isLiked ? 'text-spotify-green' : ''
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
        <span className="text-gray-400 text-sm">
          {formatDuration(track.duration_ms)}
        </span>
        <button className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

