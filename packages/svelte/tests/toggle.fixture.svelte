<script lang="ts">
  import { Toggle } from '$lib'

  let pressed = $state(false)
</script>

<Toggle.Root bind:pressed>Bold</Toggle.Root>
<output>{pressed ? 'pressed' : 'released'}</output>
