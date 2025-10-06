'use client'

import { useState } from 'react'
import { Play, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Playlist {
  id: string
  name: string
  description: string
  image: string
  type: string
  owner?: string
}

interface PlaylistCardProps {
  playlist: Playlist
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()

  const handlePlaylistClick = () => {
    // Navigate to playlist page
    router.push(`/playlist/${playlist.id}`)
  }

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent playlist navigation
    // TODO: Implement play playlist functionality
    console.log('Play playlist:', playlist.name)
  }

  return (
    <div
      className="bg-spotify-card rounded-lg p-4 card-hover cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlaylistClick}
    >
      <div className="relative mb-4">
        <img
          src={playlist.image}
          alt={playlist.name}
          className="w-full aspect-square rounded-md shadow-lg"
        />
        
        {/* Play Button Overlay */}
        <div className={`absolute bottom-2 right-2 play-button-overlay transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <button 
            onClick={handlePlayClick}
            className="bg-spotify-green text-black rounded-full p-3 shadow-lg hover:scale-105 transition-transform"
          >
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
          </button>
        </div>
      </div>
      
      <div className="min-h-[60px]">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
          {playlist.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">
          {playlist.description}
        </p>
      </div>
    </div>
  )
}
