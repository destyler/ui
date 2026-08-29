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

describe('[format] provider', () => {
  describe('format.Byte', () => {
    it('formats byte value correctly', async () => {
      const { container } = await render(ByteBasic)
      expect(container.textContent).toContain('kB')
    })

    it('formats byte value with bit unit', async () => {
      const { container } = await render(ByteWithUnit)
      expect(container.textContent).toContain('kb')
    })

    it('formats different byte sizes', async () => {
      const { container } = await render(ByteSize)
      expect(container.textContent).toContain('byte')
      expect(container.textContent).toContain('kB')
      expect(container.textContent).toContain('MB')
      expect(container.textContent).toContain('GB')
    })

    it('formats byte value with different unit displays', async () => {
      const { container } = await render(ByteWithUnitDisplay)
      expect(container.textContent).toBeTruthy()
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = await render(ByteLocale)
      expect(container.textContent).toBeTruthy()
    })
  })

  describe('format.Number', () => {
    it('formats number correctly', async () => {
      const { container } = await render(NumberBasic)
      expect(container.textContent).toBeTruthy()
    })

    it('formats number with compact notation', async () => {
      const { container } = await render(NumberWithCompact)
      expect(container.textContent).toContain('M')
    })

    it('formats number as currency', async () => {
      const { container } = await render(NumberWithCurrency)
      expect(container.textContent).toContain('$')
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = await render(NumberWithLocale)
      expect(container.textContent).toBeTruthy()
    })

    it('formats number as percentage', async () => {
      const { container } = await render(NumberWithPercentage)
      expect(container.textContent).toContain('%')
    })

    it('formats number with unit', async () => {
      const { container } = await render(NumberWithUnit)
      expect(container.textContent).toContain('km')
    })
  })
})
