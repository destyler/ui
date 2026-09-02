import type { Progress, Steps, Timer } from '@destyler-ui/solid'
import { LocaleProvider } from '@destyler-ui/solid'
import { Checkbox } from '@destyler-ui/solid/checkbox'

export type PublicNamespaceDetails = [
  Progress.ValueChangeDetails,
  Timer.Time,
  Steps.StepChangeDetails,
]

export function PackageConsumer() {
  return (
    <LocaleProvider locale="en-US">
      <Checkbox.Root checked>
        <Checkbox.Control>
          <Checkbox.Indicator>Selected</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label>Solid consumer</Checkbox.Label>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
    </LocaleProvider>
  )
}
