import { Format } from '../index'

export function NumberWithCompact() {
  return <Format.Number value={1500000} notation="compact" compactDisplay="short" />
}
