import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoritesState = {
  favorites: string[]
  addFavorite: (city: string) => void
  removeFavorite: (city: string) => void
  isFavorite: (city: string) => boolean
}

function normalizeFavoriteKey(city: string): string {
  return city.trim().toLowerCase()
}

function findFavoriteIndex(favorites: string[], city: string): number {
  const key = normalizeFavoriteKey(city)
  return favorites.findIndex((name) => normalizeFavoriteKey(name) === key)
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (city) => {
        const trimmed = city.trim()
        if (!trimmed || findFavoriteIndex(get().favorites, trimmed) !== -1) {
          return
        }

        set((state) => ({
          favorites: [...state.favorites, trimmed],
        }))
      },
      removeFavorite: (city) => {
        const index = findFavoriteIndex(get().favorites, city)
        if (index === -1) {
          return
        }

        set((state) => ({
          favorites: state.favorites.filter((_, itemIndex) => itemIndex !== index),
        }))
      },
      isFavorite: (city) => findFavoriteIndex(get().favorites, city) !== -1,
    }),
    {
      name: 'weather-favorites',
    },
  ),
)
