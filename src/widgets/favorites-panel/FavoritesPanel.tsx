import { useFavoritesStore } from '@/features/toggle-favorite'
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
        {favorites.map((city) => {
          const isActive = city === activeCity

          return (
            <li key={city} className={styles.item}>
              <button
                type="button"
                className={[styles.cityButton, isActive && styles.active]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onCitySelect(city)}
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
