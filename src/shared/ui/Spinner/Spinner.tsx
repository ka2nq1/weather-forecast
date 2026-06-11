import styles from './Spinner.module.css'

type SpinnerProps = {
  size?: 'sm' | 'md'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      className={[styles.spinner, styles[size], className].filter(Boolean).join(' ')}
      role="status"
      aria-label="Loading"
    />
  )
}
