export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeatherResponse {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  wind: {
    speed: number
  }
  weather: WeatherCondition[]
  dt: number
}

export interface ForecastListItemResponse {
  dt: number
  main: {
    temp: number
  }
  weather: WeatherCondition[]
}

export interface ForecastResponse {
  list: ForecastListItemResponse[]
}

export interface WeatherApiError {
  cod: number
  message: string
}

export interface CurrentWeather {
  cityName: string
  temp: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  dt: number
}

export interface ForecastItem {
  dt: number
  temp: number
  description: string
  icon: string
}
