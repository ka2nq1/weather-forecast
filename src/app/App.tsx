import { ErrorBoundary } from '@/app/ErrorBoundary'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { WeatherPage } from '@/pages/WeatherPage'

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <WeatherPage />
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App
