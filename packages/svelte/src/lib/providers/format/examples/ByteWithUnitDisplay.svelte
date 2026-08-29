<script lang="ts">
  import { Format } from '../index'

  const unitDisplays = ['narrow', 'short', 'long'] as const
</script>

<div>
  {#each unitDisplays as unitDisplay}
    <Format.Byte value={50345.53} {unitDisplay} />
  {/each}
</div>
