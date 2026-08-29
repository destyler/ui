<script module lang="ts">
  import type { PresenceProps } from '../index'

  export interface BasicProps extends Omit<PresenceProps, 'children' | 'present'> {}
</script>

<script lang="ts">
  import { Presence } from '../index'

  const props: BasicProps = $props()
  let present = $state(false)
</script>

<button type="button" onclick={() => present = !present}>Toggle</button>
<Presence {present} {...props} data-testid="box">I am a red box</Presence>
