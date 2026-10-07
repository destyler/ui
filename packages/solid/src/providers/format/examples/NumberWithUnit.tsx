import { Format } from '@destyler-ui/solid/format'

export function NumberWithUnit() {
  // eslint-disable-next-line solid/style-prop -- Intl.NumberFormat style is not a DOM CSS style.
  return <Format.Number value={384.4} style="unit" unit="kilometer" />
}
