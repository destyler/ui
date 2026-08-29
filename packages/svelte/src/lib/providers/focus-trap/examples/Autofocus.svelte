<script lang="ts">
  import { FocusTrap } from '../index'

  let trapped = $state(false)
  let buttonRef: HTMLButtonElement | undefined = $state()
</script>

<div>
  <button bind:this={buttonRef} type="button" onclick={() => (trapped = !trapped)}>
    {trapped ? 'End Trap' : 'Start Trap'}
  </button>
  {#if trapped}
    <FocusTrap disabled={!trapped} setReturnFocus={buttonRef}>
      <div style="display: flex; flex-direction: column; gap: 1rem; padding-block: 1rem;">
        <input type="text" placeholder="Regular input" />
        <!-- svelte-ignore a11y_autofocus -->
        <input type="text" placeholder="Autofocused input" autofocus />
        <button type="button" onclick={() => (trapped = false)}>End Trap</button>
      </div>
    </FocusTrap>
  {/if}
</div>
