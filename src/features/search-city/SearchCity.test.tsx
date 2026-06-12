// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SearchCity } from './SearchCity'

describe('SearchCity', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('syncs the input when the city prop changes', () => {
    const onCityChange = vi.fn()

    const { rerender } = render(
      <SearchCity city="London" onCityChange={onCityChange} />,
    )

    expect(screen.getByRole('textbox')).toHaveValue('London')

    rerender(<SearchCity city="Paris" onCityChange={onCityChange} />)

    expect(screen.getByRole('textbox')).toHaveValue('Paris')
  })

  it('debounces search input before notifying the parent', () => {
    const onCityChange = vi.fn()

    render(<SearchCity city="" onCityChange={onCityChange} />)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'London' },
    })

    expect(onCityChange).not.toHaveBeenCalledWith('London')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onCityChange).toHaveBeenCalledWith('London')
  })

  it('submits immediately on Enter with trimmed value', () => {
    const onCityChange = vi.fn()

    render(<SearchCity city="" onCityChange={onCityChange} />)

    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: '  London  ' } })
    fireEvent.keyDown(screen.getByLabelText('City').parentElement!, {
      key: 'Enter',
    })

    expect(input).toHaveValue('London')
    expect(onCityChange).toHaveBeenCalledWith('London')
  })
})
