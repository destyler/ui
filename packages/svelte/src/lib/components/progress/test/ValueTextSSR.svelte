<script lang="ts">
  import { Progress } from '../index'

  const { showZero = true }: { showZero?: boolean } = $props()
</script>

<Progress.Root value={42}>
  {#if showZero}
    <Progress.ValueText>{0}</Progress.ValueText>
  {:else}
    <Progress.ValueText />
  {/if}
</Progress.Root>
