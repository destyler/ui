import { Format } from '@destyler-ui/solid/format'

export function NumberWithPercentage() {
  return (
    <Format.Number
      value={0.145}
      style="percent"
      maximumFractionDigits={2}
      minimumFractionDigits={2}
    />
  )
}
