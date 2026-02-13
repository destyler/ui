import { Field } from '../../field'
import { FileUpload } from '../index'

export function WithField() {
  return (
    <Field.Root>
      <FileUpload.Root maxFiles={5}>
        <FileUpload.Label>Label</FileUpload.Label>
        <FileUpload.Trigger>Select</FileUpload.Trigger>
        <FileUpload.ItemGroup />
        <FileUpload.HiddenInput data-testid="input" />
      </FileUpload.Root>
      <Field.HelperText>Additional Info</Field.HelperText>
      <Field.ErrorText>Error Info</Field.ErrorText>
    </Field.Root>
  )
}
