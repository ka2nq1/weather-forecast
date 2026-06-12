import { isAxiosError } from 'axios'
import { httpClient } from '@/shared/api/httpClient'
import { CityNotFoundError, InvalidApiKeyError } from './errors'
import type {
  CurrentWeather,
  CurrentWeatherResponse,
  DailyForecastItem,
  ForecastBundle,
  ForecastItem,
  ForecastListItemResponse,
  ForecastResponse,
  WeatherApiError,
} from './types'

const FORECAST_HOURS = 8
const DAILY_FORECAST_DAYS = 5

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

function formatDayLabel(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const forecastDay = new Date(date)
  forecastDay.setHours(0, 0, 0, 0)

  const dayOffset = Math.round(
    (forecastDay.getTime() - today.getTime()) / 86_400_000,
  )

  if (dayOffset === 0) {
    return 'Today'
  }

  if (dayOffset === 1) {
    return 'Tomorrow'
  }

  return date.toLocaleDateString('en-GB', { weekday: 'short' })
}

function pickRepresentativeItem(
  items: ForecastListItemResponse[],
): ForecastListItemResponse {
  const middayItem = items.find((item) => {
    const hour = new Date(item.dt * 1000).getHours()
    return hour >= 12 && hour <= 15
  })

  return middayItem ?? items[Math.floor(items.length / 2)] ?? items[0]
}

function aggregateDailyForecast(
  list: ForecastListItemResponse[],
): DailyForecastItem[] {
  const itemsByDay = new Map<string, ForecastListItemResponse[]>()

  for (const item of list) {
    const dateKey = new Date(item.dt * 1000).toISOString().slice(0, 10)
    const dayItems = itemsByDay.get(dateKey) ?? []
    dayItems.push(item)
    itemsByDay.set(dateKey, dayItems)
  }

  return Array.from(itemsByDay.values())
    .slice(0, DAILY_FORECAST_DAYS)
    .map((dayItems) => {
      const representative = pickRepresentativeItem(dayItems)
      const condition = representative.weather[0]

      return {
        dt: representative.dt,
        label: formatDayLabel(representative.dt),
        minTemp: Math.min(...dayItems.map((item) => item.main.temp_min)),
        maxTemp: Math.max(...dayItems.map((item) => item.main.temp_max)),
        description: condition?.description ?? '',
        icon: condition?.icon ?? '',
      }
    })
}

function mapForecastBundle(data: ForecastResponse): ForecastBundle {
  return {
    hourly: data.list.slice(0, FORECAST_HOURS).map(mapForecastItem),
    daily: aggregateDailyForecast(data.list),
  }
}

function toGenericError(error: unknown, fallbackMessage: string): Error {
  if (isAxiosError<WeatherApiError>(error)) {
    const message = error.response?.data?.message ?? error.message
    return new Error(message || fallbackMessage)
  }

  if (error instanceof Error) {
    return new Error(error.message || fallbackMessage)
  }

  return new Error(fallbackMessage)
}

function isNotFoundError(error: unknown): boolean {
  if (!isAxiosError<WeatherApiError>(error)) {
    return false
  }

  if (error.response?.status === 404) {
    return true
  }

  const cod = error.response?.data?.cod
  return cod === 404 || cod === '404'
}

function handleApiError(error: unknown, city: string, fallbackMessage: string): never {
  if (isAxiosError(error)) {
    if (error.response?.status === 401) {
      throw new InvalidApiKeyError()
    }

    if (isNotFoundError(error)) {
      throw new CityNotFoundError(city)
    }
  }

  throw toGenericError(error, fallbackMessage)
}

export async function getCurrentWeather(city: string): Promise<CurrentWeather> {
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
  try {
    const { data } = await httpClient.get<ForecastResponse>('/forecast', {
      params: { q: city },
    })

    return mapForecastBundle(data)
  } catch (error) {
    handleApiError(error, city, 'Failed to fetch forecast')
  }
}
