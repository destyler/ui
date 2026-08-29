<script lang="ts">
  import { Presence } from '../index'

  let present = $state(false)
</script>

<button type="button" onclick={() => present = !present}>Toggle</button>
<Presence {present} lazyMount data-testid="box">Unmounted and Hidden</Presence>
