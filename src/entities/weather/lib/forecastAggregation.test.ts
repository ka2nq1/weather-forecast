import { describe, expect, it } from 'vitest'
import type { ForecastListItemResponse } from '../types'
import {
  aggregateDailyForecast,
  formatDayLabel,
  toLocalDateKey,
} from './forecastAggregation'

function createForecastItem(
  dt: number,
  tempMin: number,
  tempMax: number,
  hourLocal = 12,
): ForecastListItemResponse {
  const date = new Date(dt * 1000)
  date.setHours(hourLocal, 0, 0, 0)

  return {
    dt: Math.floor(date.getTime() / 1000),
    main: {
      temp: (tempMin + tempMax) / 2,
      temp_min: tempMin,
      temp_max: tempMax,
    },
    weather: [
      { id: 800, main: 'Clear', description: 'clear sky', icon: '01d' },
    ],
  }
}

describe('toLocalDateKey', () => {
  it('uses local calendar date instead of UTC', () => {
    const timestamp = Math.floor(
      new Date(2026, 5, 11, 23, 30, 0).getTime() / 1000,
    )

    expect(toLocalDateKey(timestamp)).toBe('2026-06-11')
  })
})

describe('formatDayLabel', () => {
  it('labels today and tomorrow relative to local midnight', () => {
    const today = new Date()
    today.setHours(15, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    expect(formatDayLabel(Math.floor(today.getTime() / 1000))).toBe('Today')
    expect(formatDayLabel(Math.floor(tomorrow.getTime() / 1000))).toBe(
      'Tomorrow',
    )
  })
})

describe('aggregateDailyForecast', () => {
  it('groups items by local day and computes min/max temps', () => {
    const dayOneMorning = createForecastItem(
      Math.floor(new Date(2026, 5, 12, 9, 0, 0).getTime() / 1000),
      10,
      14,
      9,
    )
    const dayOneAfternoon = createForecastItem(
      Math.floor(new Date(2026, 5, 12, 15, 0, 0).getTime() / 1000),
      12,
      20,
      15,
    )
    const dayTwo = createForecastItem(
      Math.floor(new Date(2026, 5, 13, 12, 0, 0).getTime() / 1000),
      8,
      16,
      12,
    )

    const result = aggregateDailyForecast([
      dayOneMorning,
      dayOneAfternoon,
      dayTwo,
    ])

    expect(result).toHaveLength(2)
    expect(result[0].minTemp).toBe(10)
    expect(result[0].maxTemp).toBe(20)
    expect(result[1].minTemp).toBe(8)
    expect(result[1].maxTemp).toBe(16)
  })

  it('returns at most five days', () => {
    const items = Array.from({ length: 8 }, (_, index) => {
      const date = new Date(2026, 5, 12 + index, 12, 0, 0)
      return createForecastItem(Math.floor(date.getTime() / 1000), 5, 10, 12)
    })

    expect(aggregateDailyForecast(items)).toHaveLength(5)
  })
})
