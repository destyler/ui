<script lang="ts">
  import type { DrawEndDetails } from '../index'
  import { Signature } from '../index'

  let imageUrl = $state<string | null>(null)

  async function handleDrawEnd(details: DrawEndDetails) {
    imageUrl = await details.getDataUrl('image/png')
  }
</script>

<Signature.Root onDrawEnd={handleDrawEnd}>
  <Signature.Label>Sign below</Signature.Label>
  <Signature.Control>
    <Signature.Segment fill="orange" />
    <Signature.ClearTrigger>Clear</Signature.ClearTrigger>
    <Signature.Guide />
  </Signature.Control>
</Signature.Root>

{#if imageUrl}
  <img src={imageUrl} alt="Signature preview" />
{/if}
