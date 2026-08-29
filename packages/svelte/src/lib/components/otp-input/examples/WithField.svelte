<script module lang="ts">
  import type { FieldRootProps } from '../../field'

  export interface WithFieldProps extends FieldRootProps {}
</script>

<script lang="ts">
  import { Field } from '../../field'
  import { OtpInput } from '../index'

  const props: WithFieldProps = $props()
</script>

<Field.Root {...props}>
  <OtpInput.Root>
    <OtpInput.Label>Label</OtpInput.Label>
    <OtpInput.Control>
      {#each [0, 1, 2] as index (index)}
        <OtpInput.Input {index} />
      {/each}
    </OtpInput.Control>
    <OtpInput.HiddenInput />
  </OtpInput.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
