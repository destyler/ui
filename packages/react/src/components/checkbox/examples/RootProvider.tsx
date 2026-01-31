import { Checkbox, useCheckbox } from '../index'

export function RootProvider() {
  const checkbox = useCheckbox()

  return (
    <>
      <span>{checkbox.checked ? 'Checked' : 'UnChecked'}</span>

      <Checkbox.RootProvider value={checkbox}>
        <Checkbox.Label>Checkbox</Checkbox.Label>
        <Checkbox.Control>
          <Checkbox.Indicator>
            x
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.HiddenInput />
      </Checkbox.RootProvider>
    </>
  )
}
