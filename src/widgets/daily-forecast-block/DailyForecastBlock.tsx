import type { DailyForecastItem } from '@/entities/weather/types'
import { WeatherIcon } from '@/shared/ui/WeatherIcon/WeatherIcon'
import styles from './DailyForecastBlock.module.css'

type DailyForecastBlockProps = {
  forecast: DailyForecastItem[]
  className?: string
}

function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`
}

export function DailyForecastBlock({
  forecast,
  className,
}: DailyForecastBlockProps) {
  return (
    <section
      className={[styles.block, styles.dailyBlock, className]
        .filter(Boolean)
        .join(' ')}
      aria-label="5-day forecast"
    >
      <h3 className={styles.title}>5-day outlook</h3>

      <ul className={styles.list}>
        {forecast.map((day) => (
          <li key={day.dt} className={styles.item}>
            <span className={styles.label}>{day.label}</span>
            <WeatherIcon
              className={styles.icon}
              icon={day.icon}
              width={36}
              height={36}
            />
            <span className={styles.temps}>
              <span className={styles.maxTemp}>
                {formatTemperature(day.maxTemp)}
              </span>
              <span className={styles.minTemp}>
                {formatTemperature(day.minTemp)}
              </span>
            </span>
            <span className={styles.description}>{day.description}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
