import { useFavoritesStore } from './store'
import styles from './ToggleFavoriteButton.module.css'

type ToggleFavoriteButtonProps = {
  city: string
}

export function ToggleFavoriteButton({ city }: ToggleFavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(city))
  const addFavorite = useFavoritesStore((state) => state.addFavorite)
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite)

  const handleClick = () => {
    if (isFavorite) {
      removeFavorite(city)
    } else {
      addFavorite(city)
    }
  }

  return (
    <button
      type="button"
      className={[styles.button, isFavorite && styles.active]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      aria-label={
        isFavorite ? `Remove ${city} from favorites` : `Add ${city} to favorites`
      }
      aria-pressed={isFavorite}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  )
}
