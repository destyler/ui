import { Format } from '@destyler-ui/solid/format'

export function NumberWithPercentage() {
  return (
    <Format.Number
      value={0.145}
      style={
        // eslint-disable-next-line solid/style-prop -- Intl.NumberFormat style is not a DOM CSS style.
        'percent'
      }
      maximumFractionDigits={2}
      minimumFractionDigits={2}
    />
  )
}
