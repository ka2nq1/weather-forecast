import {
  CityNotFoundError,
  InvalidApiKeyError,
  useCurrentWeather,
  useDailyForecast,
  useForecast,
} from '@/entities/weather'
import { SearchCity } from '@/features/search-city'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
import { DailyForecastBlock } from '@/widgets/daily-forecast-block'
import { FavoritesPanel } from '@/widgets/favorites-panel'
import { ForecastBlock } from '@/widgets/forecast-block'
import { WeatherCard } from '@/widgets/weather-card'
import { useState } from 'react'
import styles from './WeatherPage.module.css'

export function WeatherPage() {
  const [activeCity, setActiveCity] = useState('')
  const hasActiveCity = !!activeCity.trim()

  const {
    data: weather,
    isPending: isWeatherPending,
    isError: isWeatherError,
    error: weatherError,
  } = useCurrentWeather(activeCity)

  const {
    data: forecast,
    isPending: isForecastPending,
    isError: isForecastError,
    error: forecastError,
  } = useForecast(activeCity)

  const {
    data: dailyForecast,
    isPending: isDailyForecastPending,
    isError: isDailyForecastError,
    error: dailyForecastError,
  } = useDailyForecast(activeCity)

  const isPending =
    hasActiveCity &&
    (isWeatherPending || isForecastPending || isDailyForecastPending)
  const isError =
    hasActiveCity && (isWeatherError || isForecastError || isDailyForecastError)
  const error = weatherError ?? forecastError ?? dailyForecastError
  const isCityNotFound = error instanceof CityNotFoundError
  const isInvalidApiKey = error instanceof InvalidApiKeyError
  const isSuccess = hasActiveCity && weather && forecast && dailyForecast

  const renderErrorState = () => {
    if (isCityNotFound) {
      return (
        <p className={styles.errorState} role="alert">
          City not found. Check the spelling and try again.
        </p>
      )
    }

    if (isInvalidApiKey) {
      return (
        <p className={styles.errorState} role="alert">
          Invalid API key. Copy <code>.env.example</code> to <code>.env</code>{' '}
          and set <code>VITE_WEATHER_API_KEY</code>. Get a free key at{' '}
          <a
            className={styles.errorLink}
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
          >
            openweathermap.org/api
          </a>
          .
        </p>
      )
    }

    return (
      <p className={styles.errorState} role="alert">
        Could not load weather. Check your connection.
      </p>
    )
  }

  const renderCardArea = () => {
    if (!hasActiveCity) {
      return (
        <p className={styles.emptyState}>
          Enter a city to read the atmosphere.
        </p>
      )
    }

    if (isPending) {
      return <Spinner size="md" />
    }

    if (isError) {
      return renderErrorState()
    }

    if (isSuccess) {
      return <WeatherCard weather={weather} />
    }

    return null
  }

  return (
    <div className={styles.page}>
      <FavoritesPanel activeCity={activeCity} onCitySelect={setActiveCity} />

      <div
        className={[styles.main, isSuccess && styles.mainWithForecasts]
          .filter(Boolean)
          .join(' ')}
      >
        <SearchCity onCityChange={setActiveCity} />

        <div
          className={styles.cardArea}
          aria-live="polite"
          aria-busy={isPending}
        >
          <div className={styles.cardSlot}>{renderCardArea()}</div>
        </div>

        {isSuccess && (
          <div className={styles.forecastStack}>
            <ForecastBlock forecast={forecast} />
            <DailyForecastBlock forecast={dailyForecast} />
          </div>
        )}
      </div>
    </div>
  )
}
