import { Checkbox } from '../index'

export function RenderProp() {
  return (
    <Checkbox.Root>
      <Checkbox.Control>
        <Checkbox.Indicator>
          x
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Context>
        {checkbox => (
          <Checkbox.Label>
            Checkbox
            {checkbox.checked.toString()}
          </Checkbox.Label>
        )}
      </Checkbox.Context>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
