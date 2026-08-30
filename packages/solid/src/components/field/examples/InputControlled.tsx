import { Field } from '@destyler-ui/solid/field'
import { createSignal } from 'solid-js'

export interface InputControlledProps extends Field.RootProps {}

export function InputControlled(props: InputControlledProps) {
  const [value, setValue] = createSignal('Input is controlled')

  return (
    <>
      <span>Input text: {value()}</span>
      <Field.Root {...props}>
        <Field.Label>Label</Field.Label>
        <Field.Input value={value()} onInput={event => setValue(event.currentTarget.value)} />
        <Field.HelperText>Some additional Info</Field.HelperText>
        <Field.ErrorText>Error Info</Field.ErrorText>
      </Field.Root>
    </>
  )
}
