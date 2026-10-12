import { create } from 'zustand'

export const useStore = create((set) => ({
  scrollProgress: 0,
  activeSection: 'hero',
  isLoaded: false,
  soundOn: false,
  quality: 'high',
  pointer: { x: 0, y: 0 },
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  setActiveSection: (activeSection) => set({ activeSection }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
  setSoundOn: (soundOn) => set({ soundOn }),
  setQuality: (quality) => set({ quality }),
  setPointer: (pointer) => set({ pointer }),
}))
