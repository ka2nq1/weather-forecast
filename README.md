# Weather App

A weather dashboard built as a frontend take-home assignment. Dark, data-dense UI inspired by instrument panels — search cities, view current conditions, browse hourly and daily forecasts, and save favorites.

## Stack

- React 18 + TypeScript (strict)
- TanStack Query — data fetching and cache
- Zustand — favorites state with localStorage persistence
- CSS Modules — scoped styles, no utility framework
- Axios — HTTP client
- Recharts — forecast temperature graph (lazy-loaded)
- Vite + Vitest — build and unit tests

## Scripts

```bash
npm run dev      # start dev server
npm run build    # typecheck + production build
npm run test     # run unit tests
npm run lint     # ESLint
npm run format   # Prettier
npm run preview  # preview production build
```

## Getting Started

```bash
cp .env.example .env
# Add your free OpenWeatherMap API key to .env
npm install
npm run dev
```

New API keys can take a few minutes to activate on OpenWeatherMap.

## Project Structure

```
src/
  app/           providers, global styles, error boundary
  pages/         WeatherPage
  widgets/       WeatherCard, ForecastBlock, DailyForecastBlock, FavoritesPanel
  features/      search-city, toggle-favorite
  entities/      weather (types, api, hooks, pure logic)
  shared/        ui, api client, hooks
```

Layers follow Feature-Sliced Design: `app → pages → widgets → features → entities → shared`. Each layer imports only from layers below.

## API

The app uses the free [Current Weather](https://openweathermap.org/current) and [Forecast](https://openweathermap.org/forecast5) APIs:

- `GET /data/2.5/weather?q={city}` — current conditions
- `GET /data/2.5/forecast?q={city}` — 24h strip (8 × 3h) + 5-day outlook (aggregated daily min/max)

## Layout

- **Desktop:** favorites sidebar + main column with fixed search and a scrollable weather stack
- **Weather stack:** current conditions, 24-hour forecast, and 5-day outlook share one scroll container (`.weatherScroll`) on the right

## Architecture Decisions

**TanStack Query over useEffect:** Built-in loading/error states, automatic caching (5min stale time), request deduplication. Forecast hourly and daily views share one query key and `select` to split the cached bundle.

**FSD over flat feature folders:** Clear dependency direction prevents circular imports and makes the codebase navigable without a tour.

## Testing

Unit tests cover pure domain logic (forecast aggregation, API error mapping, city normalization) and the search component (debounce, Enter submit, favorite sync via `city` prop).

```bash
npm run test
```
