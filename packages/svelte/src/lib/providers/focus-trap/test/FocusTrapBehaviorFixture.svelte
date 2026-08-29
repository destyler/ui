<script lang="ts">
  import { FocusTrap } from '../index'

  let active = $state(false)
  let activations = $state(0)
  let deactivations = $state(0)
  let triggerRef: HTMLButtonElement | undefined = $state()
  let initialFocusRef: HTMLButtonElement | undefined = $state()
</script>

<button bind:this={triggerRef} type="button" onclick={() => (active = true)}>Open trap</button>

{#if active}
  <FocusTrap
    data-testid="trap-root"
    initialFocus={() => initialFocusRef}
    setReturnFocus={triggerRef}
    onActivate={() => (activations += 1)}
    onDeactivate={() => (deactivations += 1)}
  >
    <button type="button">First</button>
    <button bind:this={initialFocusRef} type="button">Initial focus</button>
    <button type="button" onclick={() => (active = false)}>Close trap</button>
  </FocusTrap>
{/if}

<output data-testid="lifecycle">{activations}:{deactivations}</output>
