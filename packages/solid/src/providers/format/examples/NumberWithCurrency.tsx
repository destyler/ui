import { Format } from '@destyler-ui/solid/format'

export function NumberWithCurrency() {
  // eslint-disable-next-line solid/style-prop -- Intl.NumberFormat style is not a DOM CSS style.
  return <Format.Number value={1234.45} style="currency" currency="USD" />
}
