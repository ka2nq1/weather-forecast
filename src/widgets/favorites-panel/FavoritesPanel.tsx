import { useFavoritesStore } from '@/features/toggle-favorite'
import { useRef, type KeyboardEvent } from 'react'
import styles from './FavoritesPanel.module.css'

type FavoritesPanelProps = {
  onCitySelect: (city: string) => void
  activeCity?: string
}

export function FavoritesPanel({
  onCitySelect,
  activeCity = '',
}: FavoritesPanelProps) {
  const favorites = useFavoritesStore((state) => state.favorites)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)
  const cityButtonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleItemKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    index: number,
  ) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      cityButtonRefs.current[index + 1]?.focus()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      cityButtonRefs.current[index - 1]?.focus()
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      onCitySelect(favorites[index])
    }
  }

  if (favorites.length === 0) {
    return (
      <aside className={styles.panel} aria-label="Favorites">
        <h3 className={styles.title}>Favorites</h3>
        <p className={styles.empty}>No favorites yet</p>
      </aside>
    )
  }

  return (
    <aside className={styles.panel} aria-label="Favorites">
      <h3 className={styles.title}>Favorites</h3>
      <ul className={styles.list}>
        {favorites.map((city, index) => {
          const isActive = city === activeCity

          return (
            <li
              key={city}
              className={styles.item}
              onKeyDown={(event) => handleItemKeyDown(event, index)}
            >
              <button
                ref={(element) => {
                  cityButtonRefs.current[index] = element
                }}
                type="button"
                className={[styles.cityButton, isActive && styles.active]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onCitySelect(city)}
                aria-current={isActive ? 'true' : undefined}
              >
                {city}
              </button>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeFavorite(city)}
                aria-label={`Remove ${city} from favorites`}
              >
                ×
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
