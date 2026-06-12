import type { DailyForecastItem } from '@/entities/weather/types'
import styles from './DailyForecastBlock.module.css'

type DailyForecastBlockProps = {
  forecast: DailyForecastItem[]
}

function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`
}

export function DailyForecastBlock({ forecast }: DailyForecastBlockProps) {
  return (
    <section className={styles.block} aria-label="5-day forecast">
      <h3 className={styles.title}>5-day outlook</h3>

      <ul className={styles.list}>
        {forecast.map((day) => (
          <li key={day.dt} className={styles.item}>
            <span className={styles.label}>{day.label}</span>
            <img
              className={styles.icon}
              src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
              alt=""
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
