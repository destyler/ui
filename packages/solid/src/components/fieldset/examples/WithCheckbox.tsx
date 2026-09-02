import { Checkbox } from '@destyler-ui/solid/checkbox'
import { Field } from '@destyler-ui/solid/field'
import { Fieldset } from '@destyler-ui/solid/fieldset'

export function WithCheckbox(props: Fieldset.RootProps) {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Fieldset.HelperText>Fieldset Helper Text</Fieldset.HelperText>
      <Fieldset.ErrorText>Fieldset Error Text</Fieldset.ErrorText>
      <Field.Root>
        <Checkbox.Root>
          <Checkbox.Label>Label</Checkbox.Label>
          <Checkbox.Control>
            <Checkbox.Indicator>✔️</Checkbox.Indicator>
          </Checkbox.Control>
          <Checkbox.HiddenInput />
        </Checkbox.Root>
        <Field.HelperText>Field Heler Text</Field.HelperText>
        <Field.ErrorText>Field Error Text</Field.ErrorText>
      </Field.Root>
    </Fieldset.Root>
  )
}
