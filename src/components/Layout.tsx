'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'
import Player from './Player'
import ArtistDetails from './ArtistDetails'
import { PlayerProvider, usePlayer } from '@/lib/player'

interface LayoutProps {
  children: React.ReactNode
}

function LayoutContent({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { currentTrack, isPlaying, pauseTrack, resumeTrack, nextTrack, previousTrack } = usePlayer()
  const pathname = usePathname()

  const handleMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    // Also toggle sidebar on desktop
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack()
    } else {
      resumeTrack()
    }
  }

  return (
    <div className="flex h-screen bg-spotify-bg text-white">
      {/* Sidebar */}
      <div className={`${mobileMenuOpen ? 'fixed inset-y-0 left-0 z-50' : 'hidden'} lg:block lg:relative lg:z-auto`}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={handleSidebarToggle} 
        />
      </div>
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header 
          onMenuClick={handleMenuClick}
          hideSearch={pathname === '/search'}
        />
        
        {/* Page Content with Artist Details */}
        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto pb-20">
            {children}
          </main>
          
          {/* Artist Details Sidebar - Only show when track is playing */}
          {currentTrack && (
            <div className="hidden xl:block">
              <ArtistDetails currentTrack={currentTrack} />
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Player - Fixed Position */}
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <Player 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={nextTrack}
          onPrevious={previousTrack}
        />
      </div>
    </div>
  )
}

export default function Layout({ children }: LayoutProps) {
  return (
    <PlayerProvider>
      <LayoutContent>{children}</LayoutContent>
    </PlayerProvider>
  )
}
