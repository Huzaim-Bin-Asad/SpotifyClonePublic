import { create } from 'zustand'

interface PlayerState {
  currentTrack: any | null
  isPlaying: boolean
  volume: number
  queue: any[]
  currentIndex: number
  
  // Actions
  setCurrentTrack: (track: any) => void
  togglePlay: () => void
  setVolume: (volume: number) => void
  addToQueue: (track: any) => void
  nextTrack: () => void
  previousTrack: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 50,
  queue: [],
  currentIndex: 0,

  setCurrentTrack: (track) => set({ currentTrack: track }),
  
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume) => set({ volume }),
  
  addToQueue: (track) => set((state) => ({ 
    queue: [...state.queue, track] 
  })),
  
  nextTrack: () => {
    const { queue, currentIndex } = get()
    if (currentIndex < queue.length - 1) {
      set({ 
        currentIndex: currentIndex + 1,
        currentTrack: queue[currentIndex + 1]
      })
    }
  },
  
  previousTrack: () => {
    const { currentIndex } = get()
    if (currentIndex > 0) {
      set({ 
        currentIndex: currentIndex - 1,
        currentTrack: get().queue[currentIndex - 1]
      })
    }
  },
}))
