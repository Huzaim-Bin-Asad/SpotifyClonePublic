'use client'

import { useState } from 'react'
import { Home, Search, Library, Plus, Heart, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [selectedItem, setSelectedItem] = useState('Home')
  const router = useRouter()

  const navigationItems = [
    { id: 'Home', icon: Home, label: 'Home', path: '/' },
    { id: 'Search', icon: Search, label: 'Search', path: '/search' },
    { id: 'Browse', icon: Library, label: 'Browse', path: '/browse' },
  ]

  const handleNavigation = (item: any) => {
    setSelectedItem(item.id)
    router.push(item.path)
  }

  const handleLogoClick = () => {
    setSelectedItem('Home')
    router.push('/')
  }

  const libraryItems = [
    { id: 'Create Playlist', icon: Plus, label: 'Create Playlist' },
    { id: 'Liked Songs', icon: Heart, label: 'Liked Songs' },
    { id: 'Downloads', icon: Download, label: 'Downloads' },
  ]

  return (
    <div className={`bg-black transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} relative flex-shrink-0 h-full`}>
      <div className={`${collapsed ? 'px-4' : 'px-6'} py-6 h-full flex flex-col`}>
        {/* Spotify Logo */}
        <div className="flex items-center mb-8 cursor-pointer" onClick={handleLogoClick}>
          <div className="w-8 h-8 flex items-center justify-center">
            <img
              src="/spotify.png"
              alt="Spotify"
              className="w-8 h-8 object-contain"
            />
          </div>
          {!collapsed && (
            <span className="ml-3 text-xl font-bold">Spotify</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center ${collapsed ? 'px-2 justify-center' : 'px-3'} py-2 rounded-md text-left transition-colors ${
                  selectedItem === item.id
                    ? 'bg-spotify-hover text-white'
                    : 'text-gray-400 hover:text-white hover:bg-spotify-hover'
                }`}
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Your Library */}
        {!collapsed && (
          <div className="mt-8 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">
                Your Library
              </h2>
              <button className="text-gray-400 hover:text-white">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="space-y-2">
              {libraryItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    className="w-full flex items-center px-3 py-2 rounded-md text-left text-gray-400 hover:text-white hover:bg-spotify-hover transition-colors"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="ml-3 truncate">{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={onToggle}
          className="mt-4 mb-20 text-gray-400 hover:text-white bg-spotify-hover rounded-full p-2 transition-colors self-center"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}
