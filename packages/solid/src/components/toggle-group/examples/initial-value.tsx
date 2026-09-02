import { ToggleGroup } from '@destyler-ui/solid/toggle-group'

export function InitialValue() {
  return (
    <ToggleGroup.Root value={['b']}>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      <ToggleGroup.Item value="c">C</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
