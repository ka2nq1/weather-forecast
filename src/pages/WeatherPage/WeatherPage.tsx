import {
  CityNotFoundError,
  InvalidApiKeyError,
  useCurrentWeather,
  useForecast,
} from '@/entities/weather'
import { SearchCity } from '@/features/search-city'
import { Spinner } from '@/shared/ui/Spinner/Spinner'
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

  const isPending = hasActiveCity && (isWeatherPending || isForecastPending)
  const isError = hasActiveCity && (isWeatherError || isForecastError)
  const error = weatherError ?? forecastError
  const isCityNotFound = error instanceof CityNotFoundError
  const isInvalidApiKey = error instanceof InvalidApiKeyError
  const isSuccess = hasActiveCity && weather && forecast

  const getErrorMessage = () => {
    if (isCityNotFound) {
      return 'City not found. Check the spelling and try again.'
    }

    if (isInvalidApiKey) {
      return 'Invalid API key. Copy .env.example to .env and set VITE_WEATHER_API_KEY.'
    }

    return 'Could not load weather. Check your connection.'
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
      return (
        <p className={styles.errorState} role="alert">
          {getErrorMessage()}
        </p>
      )
    }

    if (isSuccess) {
      return <WeatherCard weather={weather} />
    }

    return null
  }

  return (
    <div className={styles.page}>
      <FavoritesPanel
        activeCity={activeCity}
        onCitySelect={setActiveCity}
      />

      <div className={styles.main}>
        <SearchCity onCityChange={setActiveCity} />

        <div className={styles.cardArea}>{renderCardArea()}</div>

        {isSuccess && <ForecastBlock forecast={forecast} />}
      </div>
    </div>
  )
}
