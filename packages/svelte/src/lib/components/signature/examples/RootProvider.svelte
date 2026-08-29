<script lang="ts">
  import { Signature, useSignature } from '../index'

  const id = $props.id()
  const signature = useSignature({ id })
</script>

<button type="button" onclick={() => signature().clear()}>Clear</button>

<Signature.RootProvider value={signature}>
  <Signature.Label>Sign below</Signature.Label>
  <Signature.Control>
    <Signature.Segment />
    <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
    <Signature.Guide />
  </Signature.Control>
</Signature.RootProvider>
