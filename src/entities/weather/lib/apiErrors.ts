import { isAxiosError } from 'axios'
import { CityNotFoundError, InvalidApiKeyError } from '../errors'
import type { WeatherApiError } from '../types'

export function toGenericError(error: unknown, fallbackMessage: string): Error {
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

export function handleApiError(
  error: unknown,
  city: string,
  fallbackMessage: string,
): never {
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
