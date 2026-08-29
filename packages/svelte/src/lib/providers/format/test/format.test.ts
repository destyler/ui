import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import ByteBasic from '../examples/ByteBasic.svelte'
import ByteLocale from '../examples/ByteLocale.svelte'
import ByteSize from '../examples/ByteSize.svelte'
import ByteWithUnit from '../examples/ByteWithUnit.svelte'
import ByteWithUnitDisplay from '../examples/ByteWithUnitDisplay.svelte'
import NumberBasic from '../examples/NumberBasic.svelte'
import NumberWithCompact from '../examples/NumberWithCompact.svelte'
import NumberWithCurrency from '../examples/NumberWithCurrency.svelte'
import NumberWithLocale from '../examples/NumberWithLocale.svelte'
import NumberWithPercentage from '../examples/NumberWithPercentage.svelte'
import NumberWithUnit from '../examples/NumberWithUnit.svelte'
import { FormatByte, FormatNumber } from '../index'

describe('[format] provider', () => {
  describe('format.Byte', () => {
    it('formats byte value correctly', async () => {
      const { container } = await render(ByteBasic)
      expect(container.textContent).toBe('File size: 1.45 kB')
    })

    it('formats byte value with bit unit', async () => {
      const { container } = await render(ByteWithUnit)
      expect(container.textContent).toBe('File size: 1.45 kb')
    })

    it('formats different byte sizes', async () => {
      const { container } = await render(ByteSize)
      expect(container.textContent).toBe('50 byte5 kB5 MB5 GB')
    })

    it('formats byte value with different unit displays', async () => {
      const { container } = await render(ByteWithUnitDisplay)
      expect(container.textContent).toBe('50.3kB50.3 kB50.3 kilobytes')
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = await render(ByteLocale)
      expect(container.textContent).toBe('1,45 kB1.45 kB')
    })

    it('updates the formatted output when props change', async () => {
      const screen = await render(FormatByte, { props: { value: 1450.45 } })
      expect(screen.container.textContent).toBe('1.45 kB')

      await screen.rerender({ value: 5000000, unitDisplay: 'long' })
      expect(screen.container.textContent).toBe('5 megabytes')
    })
  })

  describe('format.Number', () => {
    it('formats number correctly', async () => {
      const { container } = await render(NumberBasic)
      expect(container.textContent).toBe('1,450.45')
    })

    it('formats number with compact notation', async () => {
      const { container } = await render(NumberWithCompact)
      expect(container.textContent).toBe('1.5M')
    })

    it('formats number as currency', async () => {
      const { container } = await render(NumberWithCurrency)
      expect(container.textContent).toBe('$1,234.45')
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = await render(NumberWithLocale)
      expect(container.textContent).toBe('1.450,45')
    })

    it('formats number as percentage', async () => {
      const { container } = await render(NumberWithPercentage)
      expect(container.textContent).toBe('14.50%')
    })

    it('formats number with unit', async () => {
      const { container } = await render(NumberWithUnit)
      expect(container.textContent).toBe('384.4 km')
    })

    it('updates the formatted output when props change', async () => {
      const screen = await render(FormatNumber, { props: { value: 1450.45 } })
      expect(screen.container.textContent).toBe('1,450.45')

      await screen.rerender({ value: 0.5, style: 'percent' })
      expect(screen.container.textContent).toBe('50%')
    })
  })
})
