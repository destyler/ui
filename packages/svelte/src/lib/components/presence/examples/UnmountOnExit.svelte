<script lang="ts">
  import { Presence } from '../index'

  let present = $state(false)
</script>

<button type="button" onclick={() => present = !present}>Toggle</button>
<Presence {present} unmountOnExit data-testid="box">Hidden and Unmounted on Exit</Presence>
