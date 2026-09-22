import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Basic as CircularBasic } from '../examples/circular/Basic'
import { Controlled as CircularControlled } from '../examples/circular/Controlled'
import { MinMax as CircularMinMax } from '../examples/circular/MinMax'
import { InitialValue } from '../examples/InitialValue'
import { Basic as LinearBasic } from '../examples/linear/Basic'
import { Controlled as LinearControlled } from '../examples/linear/Controlled'
import { MinMax as LinearMinMax } from '../examples/linear/MinMax'
import { Progress, progressAnatomy, useProgress } from '../index'

describe('[progress] component', () => {
  it.each(getParts(progressAnatomy).filter(p => !p.includes('view')))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(progressAnatomy))('should export %s', (part) => {
    expect(Progress[part]).toBeDefined()
  })

  it('seeds defaultValue when live value is omitted', async () => {
    render(<InitialValue />)
    await expect.element(page.getByText('70%')).toBeInTheDocument()
  })

  it('updates UI when parent controlled value changes', async () => {
    function Harness() {
      const [value, setValue] = useState<number | null>(42)
      const progress = useProgress({
        value,
        onValueChange: ({ value: next }) => setValue(next),
      })
      return (
        <>
          <button type="button" onClick={() => setValue(80)}>parent-set-80</button>
          <Progress.RootProvider value={progress}>
            <Progress.Label>Label</Progress.Label>
            <Progress.ValueText />
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.RootProvider>
        </>
      )
    }
    render(<Harness />)
    await expect.element(page.getByText('42%')).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'parent-set-80' }))
    await expect.element(page.getByText('80%')).toBeInTheDocument()
  })

  it('writes parent state back through onValueChange when api.setValue runs', async () => {
    const onValueChange = vi.fn()
    function Harness() {
      const [value, setValue] = useState<number | null>(42)
      return (
        <Progress.Root
          value={value}
          onValueChange={(details) => {
            onValueChange(details)
            setValue(details.value)
          }}
        >
          <Progress.Label>Label</Progress.Label>
          <Progress.ValueText />
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
          <Progress.Context>
            {api => (
              <button type="button" onClick={() => api.setValue(65)}>
                api-set-65
              </button>
            )}
          </Progress.Context>
        </Progress.Root>
      )
    }
    render(<Harness />)
    await expect.element(page.getByText('42%')).toBeInTheDocument()
    await userEvent.click(page.getByRole('button', { name: 'api-set-65' }))
    await vi.waitFor(() => expect(onValueChange).toHaveBeenCalled())
    await expect.element(page.getByText('65%')).toBeInTheDocument()
  })

  describe('circular progress', () => {
    it('should render circular basic progress with default value', async () => {
      render(<CircularBasic />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle controlled circular progress', async () => {
      render(<CircularControlled />)
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle min/max range in circular progress', async () => {
      render(<CircularMinMax />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      // Value is 20, min is 10, max is 30, so percentage is (20-10)/(30-10) = 50%
      await expect.element(page.getByText('50%')).toBeInTheDocument()
    })
  })

  describe('linear progress', () => {
    it('should render linear basic progress with default value', async () => {
      render(<LinearBasic />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle controlled linear progress', async () => {
      render(<LinearControlled />)
      await expect.element(page.getByText('42%')).toBeInTheDocument()
    })

    it('should handle min/max range in linear progress', async () => {
      render(<LinearMinMax />)
      await expect.element(page.getByText('Label')).toBeInTheDocument()
      // Value is 20, min is 10, max is 30, so percentage is (20-10)/(30-10) = 50%
      await expect.element(page.getByText('50%')).toBeInTheDocument()
    })
  })
})
