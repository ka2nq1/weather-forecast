import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesState = {
  favorites: string[]
  addFavorite: (city: string) => void
  removeFavorite: (city: string) => void
  isFavorite: (city: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (city) => {
        const trimmed = city.trim()
        if (!trimmed || get().favorites.includes(trimmed)) {
          return
        }

        set((state) => ({
          favorites: [...state.favorites, trimmed],
        }))
      },
      removeFavorite: (city) => {
        set((state) => ({
          favorites: state.favorites.filter((name) => name !== city),
        }))
      },
      isFavorite: (city) => get().favorites.includes(city),
    }),
    {
      name: 'weather-favorites',
    },
  ),
)
