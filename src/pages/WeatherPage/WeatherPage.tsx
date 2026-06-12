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
import { WeatherCard } from '@/widgets/weather-card'
import { lazy, Suspense, useState } from 'react'
import styles from './WeatherPage.module.css'

const ForecastBlock = lazy(() =>
  import('@/widgets/forecast-block').then((module) => ({
    default: module.ForecastBlock,
  })),
)

export function WeatherPage() {
  const [activeCity, setActiveCity] = useState('')
  const normalizedCity = activeCity.trim()
  const hasActiveCity = normalizedCity.length > 0

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

  const { data: dailyForecast } = useDailyForecast(activeCity)

  const isCityNotFound = weatherError instanceof CityNotFoundError
  const isInvalidApiKey = weatherError instanceof InvalidApiKeyError
  const showWeatherCard = hasActiveCity && weather && !isWeatherPending
  const showForecastSection =
    showWeatherCard && (isForecastPending || isForecastError || !!forecast)

  const renderWeatherError = () => {
    if (isCityNotFound) {
      return (
        <p id="weather-error" className={styles.errorState} role="alert">
          City not found. Check the spelling and try again.
        </p>
      )
    }

    if (isInvalidApiKey) {
      return (
        <p id="weather-error" className={styles.errorState} role="alert">
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
      <p id="weather-error" className={styles.errorState} role="alert">
        Could not load weather. Check your connection.
      </p>
    )
  }

  const renderCardArea = () => {
    if (!hasActiveCity) {
      return (
        <p className={styles.emptyState}>Enter a city to view the weather.</p>
      )
    }

    if (isWeatherPending) {
      return <Spinner size="md" />
    }

    if (isWeatherError) {
      return renderWeatherError()
    }

    if (weather) {
      return <WeatherCard weather={weather} />
    }

    return null
  }

  const renderForecastSection = () => {
    if (!showForecastSection) {
      return null
    }

    if (isForecastPending) {
      return (
        <div className={styles.forecastLoading}>
          <Spinner size="md" />
        </div>
      )
    }

    if (isForecastError) {
      const isForecastCityNotFound = forecastError instanceof CityNotFoundError

      return (
        <p className={styles.forecastError} role="alert">
          {isForecastCityNotFound
            ? 'Forecast unavailable for this city.'
            : 'Could not load forecast. Check your connection.'}
        </p>
      )
    }

    if (!forecast || !dailyForecast) {
      return null
    }

    return (
      <>
        <Suspense
          fallback={
            <div className={styles.forecastLoading}>
              <Spinner size="md" />
            </div>
          }
        >
          <ForecastBlock forecast={forecast} />
        </Suspense>
        <DailyForecastBlock
          className={styles.dailyWeatherBlock}
          forecast={dailyForecast}
        />
      </>
    )
  }

  return (
    <div className={styles.page}>
      <FavoritesPanel activeCity={activeCity} onCitySelect={setActiveCity} />

      <div className={styles.main}>
        <SearchCity
          city={activeCity}
          onCityChange={setActiveCity}
          isLoading={hasActiveCity && isWeatherPending}
          isInvalid={isWeatherError}
          errorId={isWeatherError ? 'weather-error' : undefined}
        />

        <div
          className={[
            styles.weatherScroll,
            showForecastSection && styles.weatherScrollWithForecasts,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div
            className={styles.cardArea}
            aria-live="polite"
            aria-busy={hasActiveCity && isWeatherPending}
          >
            <div className={styles.cardSlot}>{renderCardArea()}</div>
          </div>

          {showForecastSection && renderForecastSection()}
        </div>
      </div>
    </div>
  )
}
