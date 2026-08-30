import { Field } from '@destyler-ui/solid/field'
import { createSignal } from 'solid-js'

export interface SelectControlledProps extends Field.RootProps {}

export function SelectControlled(props: SelectControlledProps) {
  const [value, setValue] = createSignal('3')

  return (
    <>
      <span>Selected: Option {value()}</span>
      <Field.Root {...props}>
        <Field.Label>Label</Field.Label>
        <Field.Select value={value()} onInput={event => setValue(event.currentTarget.value)}>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Field.Select>
        <Field.HelperText>Some additional Info</Field.HelperText>
        <Field.ErrorText>Error Info</Field.ErrorText>
      </Field.Root>
    </>
  )
}
