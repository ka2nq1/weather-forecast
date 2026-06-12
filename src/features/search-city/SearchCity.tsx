import { useDebounce } from '@/shared/lib/useDebounce'
import { Input } from '@/shared/ui/Input/Input'
import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import styles from './SearchCity.module.css'

type SearchCityProps = {
  onCityChange: (city: string) => void
}

export function SearchCity({ onCityChange }: SearchCityProps) {
  const [inputValue, setInputValue] = useState('')
  const debouncedCity = useDebounce(inputValue, 300)

  useEffect(() => {
    onCityChange(debouncedCity)
  }, [debouncedCity, onCityChange])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      onCityChange(inputValue)
    }
  }

  return (
    <div className={styles.root} onKeyDown={handleKeyDown}>
      <label className={styles.label} htmlFor="city-search">
        City
      </label>
      <Input
        id="city-search"
        value={inputValue}
        onChange={handleChange}
        placeholder="Search city…"
      />
    </div>
  )
}
