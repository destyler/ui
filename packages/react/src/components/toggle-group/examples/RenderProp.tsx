import { ToggleGroup } from '../index'

export function RenderProp() {
  return (
    <ToggleGroup.Root>
      <ToggleGroup.Context>
        {toggleGroup => (
          <span>
            Selected:
            {toggleGroup.value.join(', ') || 'None'}
          </span>
        )}
      </ToggleGroup.Context>
      <ToggleGroup.Item value="a">A</ToggleGroup.Item>
      <ToggleGroup.Item value="b">B</ToggleGroup.Item>
      <ToggleGroup.Item value="c">C</ToggleGroup.Item>
    </ToggleGroup.Root>
  )
}
