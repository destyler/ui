import { renderToString } from 'solid-js/web'
import { expect, it } from 'vitest'
import { FormatNumber } from '../src/providers/format/Number'
import { LocaleProvider } from '../src/providers/locale'

const formats: { value: number, options: Intl.NumberFormatOptions }[] = [
  { value: 1234.45, options: { style: 'currency', currency: 'USD' } },
  { value: 0.145, options: { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 } },
  { value: 384.4, options: { style: 'unit', unit: 'kilometer' } },
]

it.each(formats)('keeps Intl $options.style semantics in SSR without browser globals', ({ value, options }) => {
  expect(typeof window).toBe('undefined')
  const html = renderToString(() => <LocaleProvider locale="en-US"><FormatNumber value={value} {...options} /></LocaleProvider>)
  expect(html).toContain(new Intl.NumberFormat('en-US', options).format(value))
})
