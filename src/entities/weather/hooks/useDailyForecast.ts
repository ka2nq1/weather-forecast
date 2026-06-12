import { useQuery } from '@tanstack/react-query'
import { getForecastBundle } from '../api'
import { isValidCity, normalizeCity } from '../lib/city'

export function useDailyForecast(city: string) {
  const normalizedCity = normalizeCity(city)

  return useQuery({
    queryKey: ['weather', 'forecast', normalizedCity],
    queryFn: () => getForecastBundle(normalizedCity),
    enabled: isValidCity(city),
    select: (data) => data.daily,
  })
}
