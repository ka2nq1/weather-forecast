import { useState } from 'react'

type WeatherIconProps = {
  icon: string
  width: number
  height: number
  className?: string
}

export function WeatherIcon({
  icon,
  width,
  height,
  className,
}: WeatherIconProps) {
  const [isHidden, setIsHidden] = useState(false)

  if (!icon || isHidden) {
    return null
  }

  return (
    <img
      className={className}
      src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
      alt=""
      width={width}
      height={height}
      onError={() => setIsHidden(true)}
    />
  )
}
