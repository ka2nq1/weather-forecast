import type { ForecastItem } from '@/entities/weather/types'
import styles from './ForecastBlock.module.css'

type ForecastBlockProps = {
  forecast: ForecastItem[]
}

const GRAPH_HEIGHT = 60
const GRAPH_WIDTH = 1000
const GRAPH_PADDING = 8
const DOT_RADIUS = 3

type GraphPoint = {
  x: number
  y: number
}

function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`
}

function buildGraphPoints(forecast: ForecastItem[]): GraphPoint[] {
  const temps = forecast.map((item) => item.temp)
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const range = max - min || 1
  const usableHeight = GRAPH_HEIGHT - GRAPH_PADDING * 2

  return forecast.map((item, index) => {
    const x =
      forecast.length === 1
        ? GRAPH_WIDTH / 2
        : (index / (forecast.length - 1)) * GRAPH_WIDTH

    const y =
      GRAPH_HEIGHT -
      GRAPH_PADDING -
      ((item.temp - min) / range) * usableHeight

    return { x, y }
  })
}

function buildPolylinePoints(points: GraphPoint[]): string {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

export function ForecastBlock({ forecast }: ForecastBlockProps) {
  const graphPoints = buildGraphPoints(forecast)

  return (
    <section className={styles.block} aria-label="24-hour forecast">
      <div className={styles.graph}>
        <svg
          className={styles.graphSvg}
          viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            className={styles.polyline}
            fill="none"
            points={buildPolylinePoints(graphPoints)}
          />
          {graphPoints.map((point, index) => (
            <circle
              key={forecast[index].dt}
              className={styles.dot}
              cx={point.x}
              cy={point.y}
              r={DOT_RADIUS}
            />
          ))}
        </svg>
      </div>

      <div className={styles.strip}>
        {forecast.map((item) => (
          <div key={item.dt} className={styles.item}>
            <time className={styles.time} dateTime={new Date(item.dt * 1000).toISOString()}>
              {formatTime(item.dt)}
            </time>
            <img
              className={styles.icon}
              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt=""
              width={40}
              height={40}
            />
            <span className={styles.temp}>{formatTemperature(item.temp)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
