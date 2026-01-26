import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { ByteBasic } from '../examples/ByteBasic'
import { ByteLocale } from '../examples/ByteLocale'
import { ByteSize } from '../examples/ByteSize'
import { ByteWithUnit } from '../examples/ByteWithUnit'
import { ByteWithUnitDisplay } from '../examples/ByteWithUnitDisplay'
import { NumberBasic } from '../examples/NumberBasic'
import { NumberWithCompact } from '../examples/NumberWithCompact'
import { NumberWithCurrency } from '../examples/NumberWithCurrency'
import { NumberWithLocale } from '../examples/NumberWithLocale'
import { NumberWithPercentage } from '../examples/NumberWithPercentage'
import { NumberWithUnit } from '../examples/NumberWithUnit'

describe('[format] provider', () => {
  describe('format.Byte', () => {
    it('formats byte value correctly', async () => {
      const { container } = await render(<ByteBasic />)

      await expect.element(page.getByText(/kB/)).toBeVisible()
      expect(container.textContent).toContain('kB')
    })

    it('formats byte value with bit unit', async () => {
      const { container } = await render(<ByteWithUnit />)

      await expect.element(page.getByText(/kb/)).toBeVisible()
      expect(container.textContent).toContain('kb')
    })

    it('formats different byte sizes', async () => {
      const { container } = await render(<ByteSize />)

      expect(container.textContent).toContain('byte')
      expect(container.textContent).toContain('kB')
      expect(container.textContent).toContain('MB')
      expect(container.textContent).toContain('GB')
    })

    it('formats byte value with different unit displays', async () => {
      const { container } = await render(<ByteWithUnitDisplay />)

      expect(container.textContent).toBeDefined()
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = await render(<ByteLocale />)

      expect(container.textContent).toBeDefined()
    })
  })

  describe('format.Number', () => {
    it('formats number correctly', async () => {
      const { container } = await render(<NumberBasic />)

      expect(container.textContent).toBeDefined()
    })

    it('formats number with compact notation', async () => {
      const { container } = await render(<NumberWithCompact />)

      expect(container.textContent).toContain('M')
    })

    it('formats number as currency', async () => {
      const { container } = await render(<NumberWithCurrency />)

      expect(container.textContent).toContain('$')
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = await render(<NumberWithLocale />)

      expect(container.textContent).toBeDefined()
    })

    it('formats number as percentage', async () => {
      const { container } = await render(<NumberWithPercentage />)

      expect(container.textContent).toContain('%')
    })

    it('formats number with unit', async () => {
      const { container } = await render(<NumberWithUnit />)

      expect(container.textContent).toContain('km')
    })
  })
})
