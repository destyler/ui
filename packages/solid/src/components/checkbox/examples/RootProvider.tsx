import { Checkbox, useCheckbox } from '@destyler-ui/solid/checkbox'
import { CheckIcon } from 'lucide-solid'

export function RootProvider() {
  const checkbox = useCheckbox()

  return (
    <>
      <span>{checkbox().checked ? 'Checked' : 'UnChecked'}</span>

      <Checkbox.RootProvider value={checkbox}>
        <Checkbox.Label>Checkbox</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.RootProvider>
    </>
  )
}
