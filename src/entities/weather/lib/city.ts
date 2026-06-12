export function normalizeCity(city: string): string {
  return city.trim()
}

export function isValidCity(city: string): boolean {
  return normalizeCity(city).length > 0
}
