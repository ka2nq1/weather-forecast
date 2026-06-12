import { QueryProvider } from '@/app/providers/QueryProvider'
import { WeatherPage } from '@/pages/WeatherPage'

function App() {
  return (
    <QueryProvider>
      <WeatherPage />
    </QueryProvider>
  )
}

export default App
