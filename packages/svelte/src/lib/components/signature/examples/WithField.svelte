<script module lang="ts">
  import type { FieldRootProps } from '../../field'

  export interface WithFieldProps extends FieldRootProps {}
</script>

<script lang="ts">
  import type { DrawEndDetails } from '../index'
  import { Field } from '../../field'
  import { Signature } from '../index'

  const props: WithFieldProps = $props()
  let imageUrl = $state('')

  async function handleDrawEnd(details: DrawEndDetails) {
    imageUrl = await details.getDataUrl('image/png')
  }
</script>

<Field.Root {...props}>
  <Signature.Root onDrawEnd={handleDrawEnd}>
    <Signature.Label>Label</Signature.Label>
    <Signature.Control>
      <Signature.Segment />
      <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
      <Signature.Guide />
    </Signature.Control>
    <Signature.HiddenInput value={imageUrl} />
  </Signature.Root>
  <Field.HelperText>Additional Info</Field.HelperText>
  <Field.ErrorText>Error Info</Field.ErrorText>
</Field.Root>
