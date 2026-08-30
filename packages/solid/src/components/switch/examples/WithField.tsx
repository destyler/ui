import { Field } from '@destyler-ui/solid/field'
import { Switch } from '@destyler-ui/solid/switch'

export function WithField(props: Field.RootProps) {
  return (
    <Field.Root {...props}>
      <Switch.Root>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Label</Switch.Label>
        <Switch.HiddenInput />
      </Switch.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
