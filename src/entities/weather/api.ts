import { httpClient } from '@/shared/api/httpClient'
import { InvalidApiKeyError } from './errors'
import { handleApiError } from './lib/apiErrors'
import { aggregateDailyForecast } from './lib/forecastAggregation'
import type {
  CurrentWeather,
  CurrentWeatherResponse,
  ForecastBundle,
  ForecastItem,
  ForecastListItemResponse,
  ForecastResponse,
} from './types'

const FORECAST_HOURS = 8

function assertApiKeyConfigured(): void {
  if (!import.meta.env.VITE_WEATHER_API_KEY?.trim()) {
    throw new InvalidApiKeyError()
  }
}

function mapCurrentWeather(data: CurrentWeatherResponse): CurrentWeather {
  const condition = data.weather[0]

  return {
    cityName: data.name,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: condition?.description ?? '',
    icon: condition?.icon ?? '',
    dt: data.dt,
  }
}

function mapForecastItem(item: ForecastListItemResponse): ForecastItem {
  const condition = item.weather[0]

  return {
    dt: item.dt,
    temp: item.main.temp,
    description: condition?.description ?? '',
    icon: condition?.icon ?? '',
  }
}

function mapForecastBundle(data: ForecastResponse): ForecastBundle {
  return {
    hourly: data.list.slice(0, FORECAST_HOURS).map(mapForecastItem),
    daily: aggregateDailyForecast(data.list),
  }
}

export async function getCurrentWeather(city: string): Promise<CurrentWeather> {
  assertApiKeyConfigured()

  try {
    const { data } = await httpClient.get<CurrentWeatherResponse>('/weather', {
      params: { q: city },
    })

    return mapCurrentWeather(data)
  } catch (error) {
    handleApiError(error, city, 'Failed to fetch current weather')
  }
}

export async function getForecastBundle(city: string): Promise<ForecastBundle> {
  assertApiKeyConfigured()

  try {
    const { data } = await httpClient.get<ForecastResponse>('/forecast', {
      params: { q: city },
    })

    return mapForecastBundle(data)
  } catch (error) {
    handleApiError(error, city, 'Failed to fetch forecast')
  }
}
