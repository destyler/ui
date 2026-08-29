<script lang="ts">
  import { Format } from '../index'

  const byteSizes = [50, 5000, 5000000, 5000000000]
</script>

<div>
  {#each byteSizes as size}
    <div><Format.Byte value={size} /></div>
  {/each}
</div>
