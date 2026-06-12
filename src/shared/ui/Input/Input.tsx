import type { ChangeEvent } from 'react'
import { Spinner } from '../Spinner/Spinner'
import styles from './Input.module.css'

type InputProps = {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  isLoading?: boolean
  id?: string
  className?: string
}

export function Input({
  value,
  onChange,
  placeholder,
  isLoading = false,
  id,
  className,
}: InputProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <input
        id={id}
        className={styles.input}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-busy={isLoading}
      />
      {isLoading && (
        <span className={styles.spinnerSlot}>
          <Spinner size="sm" />
        </span>
      )}
    </div>
  )
}
