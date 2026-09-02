import { Format } from '@destyler-ui/solid/format'

export function NumberWithUnit() {
  return <Format.Number value={384.4} style="unit" unit="kilometer" />
}
