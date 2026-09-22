<script lang="ts">
  import { Toggle } from '../index'

  let pressed = $state(false)
</script>

<output>{String(pressed)}</output>
<Toggle.Root bind:pressed>
  <Toggle.Indicator>✓</Toggle.Indicator>
  Toggle
</Toggle.Root>
