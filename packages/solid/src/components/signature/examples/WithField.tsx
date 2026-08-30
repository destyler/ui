import { Field } from '@destyler-ui/solid/field'
import { Signature } from '@destyler-ui/solid/signature'
import { createSignal } from 'solid-js'

export function WithField(props: Field.RootProps) {
  const [value, setValue] = createSignal('')

  return (
    <Field.Root {...props}>
      <Signature.Root
        onDrawEnd={details => details.getDataUrl('image/png').then(url => setValue(url))}
      >
        <Signature.Label>Label</Signature.Label>
        <Signature.Control>
          <Signature.Segment />
          <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
          <Signature.Guide />
        </Signature.Control>
        <Signature.HiddenInput value={value()} />
      </Signature.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
