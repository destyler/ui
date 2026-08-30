import { ToggleGroup } from '@destyler-ui/solid/toggle-group'
import { createSignal } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal(['a'])

  return (
    <ToggleGroup.Root value={value()} onValueChange={details => setValue(details.value)}>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      <ToggleGroup.Item value="c">C</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
