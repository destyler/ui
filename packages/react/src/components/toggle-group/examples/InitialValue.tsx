import { ToggleGroup } from '../index'

export function InitialValue() {
  return (
    <ToggleGroup.Root defaultValue={['a']}>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      <ToggleGroup.Item value="c">C</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
