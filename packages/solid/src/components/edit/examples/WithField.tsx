import { Edit } from '@destyler-ui/solid/edit'
import { Field } from '@destyler-ui/solid/field'

export function WithField(props: Field.RootProps) {
  return (
    <Field.Root {...props} readOnly>
      <Edit.Root placeholder="Placeholder" activationMode="dblclick">
        <Edit.Label>Label</Edit.Label>
        <Edit.Area>
          <Edit.Input />
          <Edit.Preview />
        </Edit.Area>
      </Edit.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
