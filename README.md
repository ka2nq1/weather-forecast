# Weather App

A weather dashboard built as a frontend take-home assignment.

## Stack

- React 18 + TypeScript (strict)
- TanStack Query — data fetching and cache
- Zustand — favorites state with localStorage persistence
- CSS Modules — scoped styles, no utility framework
- Axios — HTTP client
- Recharts — forecast temperature graph
- Vite — build tool

## Architecture

Feature-Sliced Design (FSD lite). Layers: app → pages → widgets → features → entities → shared. Each layer imports only from layers below.

## Getting Started

```bash
cp .env.example .env
# Add your free OpenWeatherMap API key to .env
npm install
npm run dev
```

## API

The app uses the free [Current Weather](https://openweathermap.org/current) and [5 Day / 3 Hour Forecast](https://openweathermap.org/forecast5) APIs:

- `GET /data/2.5/weather?q={city}` — current conditions
- `GET /data/2.5/forecast?q={city}` — 24h strip (8 × 3h) + 5-day outlook (aggregated daily min/max)

## Architecture Decisions

**TanStack Query over useEffect:** Built-in loading/error states, automatic caching (5min stale time), request deduplication. No manual loading booleans needed.

**FSD over feature folders:** Clear dependency direction between layers prevents circular imports and makes the codebase navigable for a new team member without a tour.

**CSS Modules over Tailwind:** Styles co-located with components, no purge config, no className string logic. Easier to audit what styles apply to what.

**Recharts for the forecast graph:** A minimal `LineChart` with hidden axes keeps the API simple while handling scaling, domains, and responsive layout reliably.
