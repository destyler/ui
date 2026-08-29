<script module lang="ts">
  import type { FieldRootProps } from '../../field'

  export interface WithFieldProps extends FieldRootProps {}
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { FileUpload } from '../index'

  const props: WithFieldProps = $props()
</script>

<Field.Root {...props}>
  <FileUpload.Root maxFiles={5}>
    <FileUpload.Label>Label</FileUpload.Label>
    <FileUpload.Trigger>Select</FileUpload.Trigger>
    <FileUpload.ItemGroup />
    <FileUpload.HiddenInput data-testid="input" />
  </FileUpload.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
