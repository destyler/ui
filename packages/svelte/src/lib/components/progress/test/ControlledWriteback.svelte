<script lang="ts">
  import { Progress } from '../index'

  let value = $state<number | null>(42)
</script>

<button type="button" onclick={() => (value = 80)}>parent-set-80</button>
<Progress.Root bind:value>
  <Progress.Label>Label</Progress.Label>
  <Progress.ValueText />
  <Progress.Track>
    <Progress.Range />
  </Progress.Track>
  <Progress.Context>
    {#snippet api(progress)}
      <button type="button" onclick={() => progress().setValue(65)}>api-set-65</button>
    {/snippet}
  </Progress.Context>
</Progress.Root>
