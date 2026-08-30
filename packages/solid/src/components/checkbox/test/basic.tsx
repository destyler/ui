import { CheckIcon, MinusIcon } from 'lucide-solid'
import { Checkbox } from '../'

export function ComponentUnderTest(props: Checkbox.RootProps) {
  return (
    <Checkbox.Group>
      <Checkbox.Root {...props}>
        <Checkbox.Label>Checkbox</Checkbox.Label>
        <Checkbox.Control data-testid="control">
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
          <Checkbox.Indicator indeterminate>
            <MinusIcon />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
    </Checkbox.Group>
  )
}
