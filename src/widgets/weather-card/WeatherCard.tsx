import type { CurrentWeather } from '@/entities/weather/types'
import { ToggleFavoriteButton } from '@/features/toggle-favorite'
import styles from './WeatherCard.module.css'

type WeatherCardProps = {
  weather: CurrentWeather
}

function getTemperatureColor(temp: number): string {
  if (temp < 10) {
    return 'var(--color-accent-cold)'
  }

  if (temp > 20) {
    return 'var(--color-accent-warm)'
  }

  return 'var(--color-text-primary)'
}

function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const temperature = Math.round(weather.temp)
  const temperatureColor = getTemperatureColor(weather.temp)

  return (
    <article className={styles.card}>
      <span className={styles.watermark} aria-hidden="true">
        {temperature}
      </span>

      <div className={styles.header}>
        <h2 className={styles.city}>{weather.cityName}</h2>
        <ToggleFavoriteButton city={weather.cityName} />
      </div>

      <div className={styles.main}>
        <img
          className={styles.icon}
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt=""
          width={80}
          height={80}
        />
        <p
          className={styles.temperature}
          style={{ color: temperatureColor }}
        >
          {formatTemperature(weather.temp)}
        </p>
      </div>

      <p className={styles.description}>{weather.description}</p>

      <dl className={styles.stats}>
        <div className={styles.stat}>
          <dd className={styles.statValue}>{weather.humidity}%</dd>
          <dt className={styles.statLabel}>Humidity</dt>
        </div>
        <div className={styles.stat}>
          <dd className={styles.statValue}>{weather.windSpeed} m/s</dd>
          <dt className={styles.statLabel}>Wind</dt>
        </div>
        <div className={styles.stat}>
          <dd className={styles.statValue}>
            {formatTemperature(weather.feelsLike)}
          </dd>
          <dt className={styles.statLabel}>Feels like</dt>
        </div>
      </dl>
    </article>
  )
}
