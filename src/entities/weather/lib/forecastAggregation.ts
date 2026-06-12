import type {
  DailyForecastItem,
  ForecastListItemResponse,
} from '../types'

const DAILY_FORECAST_DAYS = 5

export function toLocalDateKey(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-CA')
}

export function formatDayLabel(timestamp: number): string {
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

export function pickRepresentativeItem(
  items: ForecastListItemResponse[],
): ForecastListItemResponse {
  const middayItem = items.find((item) => {
    const hour = new Date(item.dt * 1000).getHours()
    return hour >= 12 && hour <= 15
  })

  return middayItem ?? items[Math.floor(items.length / 2)] ?? items[0]
}

export function aggregateDailyForecast(
  list: ForecastListItemResponse[],
): DailyForecastItem[] {
  const itemsByDay = new Map<string, ForecastListItemResponse[]>()

  for (const item of list) {
    const dateKey = toLocalDateKey(item.dt)
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
