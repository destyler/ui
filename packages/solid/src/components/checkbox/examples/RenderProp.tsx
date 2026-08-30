import { Checkbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon } from 'lucide-solid'

export function RenderProp() {
  return (
    <Checkbox.Root>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Context>
        {checkbox => <Checkbox.Label>Checkbox {checkbox().checked.toString()}</Checkbox.Label>}
      </Checkbox.Context>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  )
}
