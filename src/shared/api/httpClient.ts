import axios from 'axios'

export const httpClient = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: {
    appid: import.meta.env.VITE_WEATHER_API_KEY,
    units: 'metric',
    lang: 'en',
  },
})
