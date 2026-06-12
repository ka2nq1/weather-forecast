import { describe, expect, it } from 'vitest'
import { isValidCity, normalizeCity } from './city'

describe('city helpers', () => {
  it('trims whitespace from city names', () => {
    expect(normalizeCity('  London  ')).toBe('London')
  })

  it('rejects whitespace-only cities', () => {
    expect(isValidCity('   ')).toBe(false)
    expect(isValidCity('Paris')).toBe(true)
  })
})
