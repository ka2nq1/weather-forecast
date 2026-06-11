import { isAxiosError } from 'axios'
import { httpClient } from '@/shared/api/httpClient'
import { CityNotFoundError } from './errors'
import type {
  CurrentWeather,
  CurrentWeatherResponse,
  ForecastItem,
  ForecastListItemResponse,
  ForecastResponse,
  WeatherApiError,
} from './types'

const FORECAST_HOURS = 8

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

function handleApiError(error: unknown, city: string, fallbackMessage: string): never {
  if (isAxiosError(error) && error.response?.status === 404) {
    throw new CityNotFoundError(city)
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

export async function getForecast(city: string): Promise<ForecastItem[]> {
  try {
    const { data } = await httpClient.get<ForecastResponse>('/forecast', {
      params: { q: city },
    })

    return data.list.slice(0, FORECAST_HOURS).map(mapForecastItem)
  } catch (error) {
    handleApiError(error, city, 'Failed to fetch forecast')
  }
}
