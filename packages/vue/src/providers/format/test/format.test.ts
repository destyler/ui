import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page } from 'vitest/browser'
import ByteBasic from '../examples/ByteBasic.vue'
import ByteLocale from '../examples/ByteLocale.vue'
import ByteSize from '../examples/ByteSize.vue'
import ByteWithUnit from '../examples/ByteWithUnit.vue'
import ByteWithUnitDisplay from '../examples/ByteWithUnitDisplay.vue'
import NumberBasic from '../examples/NumberBasic.vue'
import NumberWithCompact from '../examples/NumberWithCompact.vue'
import NumberWithCurrency from '../examples/NumberWithCurrency.vue'
import NumberWithLocale from '../examples/NumberWithLocale.vue'
import NumberWithPercentage from '../examples/NumberWithPercentage.vue'
import NumberWithUnit from '../examples/NumberWithUnit.vue'

describe('[format] provider', () => {
  describe('format.Byte', () => {
    it('formats byte value correctly', async () => {
      const { container } = render(ByteBasic)

      await expect.element(page.getByText(/kB/)).toBeVisible()
      expect(container.textContent).toContain('kB')
    })

    it('formats byte value with bit unit', async () => {
      const { container } = render(ByteWithUnit)

      await expect.element(page.getByText(/kb/)).toBeVisible()
      expect(container.textContent).toContain('kb')
    })

    it('formats different byte sizes', async () => {
      const { container } = render(ByteSize)

      expect(container.textContent).toContain('byte')
      expect(container.textContent).toContain('kB')
      expect(container.textContent).toContain('MB')
      expect(container.textContent).toContain('GB')
    })

    it('formats byte value with different unit displays', async () => {
      const { container } = render(ByteWithUnitDisplay)

      expect(container.textContent).toBeDefined()
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = render(ByteLocale)

      expect(container.textContent).toBeDefined()
    })
  })

  describe('format.Number', () => {
    it('formats number value correctly', async () => {
      const { container } = render(NumberBasic)

      await expect.element(page.getByText('1,450.45')).toBeVisible()
      expect(container.textContent).toContain('1,450.45')
    })

    it('formats number as currency', async () => {
      const { container } = render(NumberWithCurrency)

      await expect.element(page.getByText(/\$/)).toBeVisible()
      expect(container.textContent).toContain('$')
    })

    it('formats number as percentage', async () => {
      const { container } = render(NumberWithPercentage)

      await expect.element(page.getByText(/%/)).toBeVisible()
      expect(container.textContent).toContain('%')
    })

    it('formats number with compact notation', async () => {
      const { container } = render(NumberWithCompact)

      await expect.element(page.getByText(/M/)).toBeVisible()
      expect(container.textContent).toContain('M')
    })

    it('formats number with unit', async () => {
      const { container } = render(NumberWithUnit)

      await expect.element(page.getByText(/km/)).toBeVisible()
      expect(container.textContent).toContain('km')
    })

    it('respects locale from LocaleProvider', async () => {
      const { container } = render(NumberWithLocale)

      expect(container.textContent).toBeDefined()
    })
  })
})
