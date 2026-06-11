export class CityNotFoundError extends Error {
  constructor(city?: string) {
    super(city ? `City not found: ${city}` : 'City not found')
    this.name = 'CityNotFoundError'
  }
}
