import { Format } from '../index'

export function NumberWithUnit() {
  return <Format.Number value={384.4} style="unit" unit="kilometer" />
}
