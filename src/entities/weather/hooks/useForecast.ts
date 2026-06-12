import { useQuery } from '@tanstack/react-query'
import { getForecast } from '../api'

export function useForecast(city: string) {
  return useQuery({
    queryKey: ['weather', 'forecast', city],
    queryFn: () => getForecast(city),
    enabled: !!city,
  })
}
