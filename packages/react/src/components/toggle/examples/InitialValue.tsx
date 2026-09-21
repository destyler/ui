import { Toggle } from '../index'

export function InitialValue() {
  return (
    <Toggle.Root defaultPressed>
      <Toggle.Indicator>
        ✓
      </Toggle.Indicator>
      Toggle
    </Toggle.Root>
  )
}
