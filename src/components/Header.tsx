'use client'

import { useState } from 'react'
import { Search, Bell, User, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick?: () => void
  hideSearch?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export default function Header({ onMenuClick, hideSearch = false, searchQuery: externalSearchQuery, onSearchChange }: HeaderProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery

  return (
    <header className="bg-spotify-bg border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Navigation Buttons */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* Desktop Navigation Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar - Conditionally rendered */}
        {!hideSearch && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="What do you want to play?"
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value
                  if (onSearchChange) {
                    onSearchChange(value)
                  } else {
                    setInternalSearchQuery(value)
                  }
                }}
                className="w-full bg-white text-black rounded-full px-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green"
              />
            </div>
          </div>
        )}

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {/* Desktop Menu Toggle Button */}
          <button 
            onClick={onMenuClick}
            className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Bell className="w-6 h-6" />
          </button>
          <button className="bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
