import { Format } from '@destyler-ui/solid/format'

export function NumberWithCurrency() {
  return <Format.Number value={1234.45} style="currency" currency="USD" />
}
