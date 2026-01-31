import { Field } from '../../field'
import { Fieldset } from '../index'

export interface WithFieldProps extends Fieldset.RootProps {}

export function WithField(props: WithFieldProps) {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <Fieldset.HelperText>Fieldset Helper Text</Fieldset.HelperText>
      <Fieldset.ErrorText>Fieldset Error Text</Fieldset.ErrorText>
      <Field.Root>
        <Field.Label>Label</Field.Label>
        <Field.Input />
        <Field.HelperText>Field Helper Text</Field.HelperText>
        <Field.ErrorText>Field Error Text</Field.ErrorText>
      </Field.Root>
    </Fieldset.Root>
  )
}
