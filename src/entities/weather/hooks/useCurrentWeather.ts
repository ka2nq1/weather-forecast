import { useQuery } from '@tanstack/react-query'
import { getCurrentWeather } from '../api'
import { isValidCity, normalizeCity } from '../lib/city'

export function useCurrentWeather(city: string) {
  const normalizedCity = normalizeCity(city)

  return useQuery({
    queryKey: ['weather', 'current', normalizedCity],
    queryFn: () => getCurrentWeather(normalizedCity),
    enabled: isValidCity(city),
  })
}
