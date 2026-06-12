import { useQuery } from '@tanstack/react-query'
import { getForecastBundle } from '../api'

export function useDailyForecast(city: string) {
  return useQuery({
    queryKey: ['weather', 'forecast', city],
    queryFn: () => getForecastBundle(city),
    enabled: !!city,
    select: (data) => data.daily,
  })
}
