import { Field } from '@destyler-ui/solid/field'
import { createSignal } from 'solid-js'

export interface TextareaControlledProps extends Field.RootProps {}

export function TextareaControlled(props: TextareaControlledProps) {
  const [value, setValue] = createSignal('This is some text\nthen more text')

  return (
    <>
      <span>Textarea value: {value()}</span>
      <Field.Root {...props}>
        <Field.Label>Label</Field.Label>
        <Field.Textarea value={value()} onInput={event => setValue(event.currentTarget.value)} />
        <Field.HelperText>Some additional Info</Field.HelperText>
        <Field.ErrorText>Error Info</Field.ErrorText>
      </Field.Root>
    </>
  )
}
