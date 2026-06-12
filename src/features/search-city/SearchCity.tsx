import { useDebounce } from '@/shared/lib/useDebounce'
import { Input } from '@/shared/ui/Input/Input'
import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import styles from './SearchCity.module.css'

type SearchCityProps = {
  city: string
  onCityChange: (city: string) => void
  isLoading?: boolean
  isInvalid?: boolean
  errorId?: string
}

export function SearchCity({
  city,
  onCityChange,
  isLoading = false,
  isInvalid = false,
  errorId,
}: SearchCityProps) {
  const [inputValue, setInputValue] = useState(city)
  const debouncedCity = useDebounce(inputValue, 300)

  useEffect(() => {
    setInputValue(city)
  }, [city])

  useEffect(() => {
    onCityChange(debouncedCity)
  }, [debouncedCity, onCityChange])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const trimmed = inputValue.trim()
      setInputValue(trimmed)
      onCityChange(trimmed)
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
        isLoading={isLoading}
        isInvalid={isInvalid}
        describedBy={errorId}
      />
    </div>
  )
}
