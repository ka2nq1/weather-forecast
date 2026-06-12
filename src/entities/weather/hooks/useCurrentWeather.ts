import { useQuery } from '@tanstack/react-query'
import { getCurrentWeather } from '../api'

export function useCurrentWeather(city: string) {
  return useQuery({
    queryKey: ['weather', 'current', city],
    queryFn: () => getCurrentWeather(city),
    enabled: !!city,
  })
}
