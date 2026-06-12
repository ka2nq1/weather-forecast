import { AxiosError, AxiosHeaders } from 'axios'
import { describe, expect, it } from 'vitest'
import { CityNotFoundError, InvalidApiKeyError } from '../errors'
import { handleApiError, toGenericError } from './apiErrors'

function createAxiosError(status: number, data?: { cod?: number | string }) {
  return new AxiosError(
    'Request failed',
    String(status),
    undefined,
    undefined,
    {
      status,
      statusText: 'Error',
      headers: {},
      config: { headers: new AxiosHeaders() },
      data,
    },
  )
}

describe('handleApiError', () => {
  it('throws InvalidApiKeyError for 401 responses', () => {
    expect(() =>
      handleApiError(createAxiosError(401), 'London', 'fallback'),
    ).toThrow(InvalidApiKeyError)
  })

  it('throws CityNotFoundError for 404 responses', () => {
    expect(() =>
      handleApiError(createAxiosError(404), 'Narnia', 'fallback'),
    ).toThrow(CityNotFoundError)
  })

  it('throws CityNotFoundError when API cod is 404', () => {
    expect(() =>
      handleApiError(createAxiosError(400, { cod: '404' }), 'Narnia', 'fallback'),
    ).toThrow(CityNotFoundError)
  })

  it('wraps unknown errors with a generic message', () => {
    expect(() => handleApiError(new Error('offline'), 'London', 'fallback')).toThrow(
      'offline',
    )
  })
})

describe('toGenericError', () => {
  it('falls back when error has no message', () => {
    expect(toGenericError({}, 'fallback').message).toBe('fallback')
  })
})
