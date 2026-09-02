import { Format } from '@destyler-ui/solid/format'

export function NumberWithCompact() {
  return <Format.Number value={1500000} notation="compact" compactDisplay="short" />
}
