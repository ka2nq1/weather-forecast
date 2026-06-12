import type { ForecastItem } from '@/entities/weather/types'
import { WeatherIcon } from '@/shared/ui/WeatherIcon/WeatherIcon'
import type { CSSProperties } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import styles from './ForecastBlock.module.css'

type ForecastBlockProps = {
  forecast: ForecastItem[]
}

type ChartPoint = {
  x: number
  temp: number
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

function buildChartData(forecast: ForecastItem[]): ChartPoint[] {
  return forecast.map((item, index) => ({
    x: index + 0.5,
    temp: Math.round(item.temp),
  }))
}

function buildTrendSummary(forecast: ForecastItem[]): string {
  if (forecast.length === 0) {
    return ''
  }

  const temps = forecast.map((item) => Math.round(item.temp))
  const min = Math.min(...temps)
  const max = Math.max(...temps)

  return `Temperature trend from ${formatTemperature(temps[0])} to ${formatTemperature(temps[temps.length - 1])}, ranging from ${min}° to ${max}° over the next 24 hours.`
}

export function ForecastBlock({ forecast }: ForecastBlockProps) {
  const chartData = buildChartData(forecast)
  const columnCount = forecast.length
  const trendSummary = buildTrendSummary(forecast)

  const layoutStyle = {
    '--forecast-cols': columnCount,
  } as CSSProperties

  return (
    <section className={styles.block} aria-label="24-hour forecast">
      <h3 className={styles.title}>24-hour forecast</h3>
      <p className={styles.srOnly}>{trendSummary}</p>
      <div className={styles.forecastLayout} style={layoutStyle}>
        <div className={styles.graph} aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
            >
              <XAxis
                type="number"
                dataKey="x"
                domain={[0, columnCount]}
                allowDecimals={false}
                hide
              />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="var(--color-accent-cold)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-accent-cold)', r: 3, strokeWidth: 0 }}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.strip}>
          {forecast.map((item) => (
            <div key={item.dt} className={styles.item}>
              <time
                className={styles.time}
                dateTime={new Date(item.dt * 1000).toISOString()}
              >
                {formatTime(item.dt)}
              </time>
              <WeatherIcon
                className={styles.icon}
                icon={item.icon}
                width={36}
                height={36}
              />
              <span className={styles.temp}>
                {formatTemperature(item.temp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
