<script lang="ts">
  import { FocusTrap } from '../index'

  let trapped = $state(false)
  let inputRef: HTMLInputElement | undefined = $state()
</script>

<div>
  <button type="button" onclick={() => (trapped = !trapped)}>{trapped ? 'End Trap' : 'Start Trap'}</button>
  <FocusTrap disabled={!trapped} initialFocus={() => inputRef}>
    <div style="display: flex; flex-direction: column; gap: 1rem; padding-block: 1rem;">
      <input type="text" placeholder="First input" />
      <input bind:this={inputRef} type="text" placeholder="Second input (initial focus)" />
      <textarea placeholder="textarea"></textarea>
      <button type="button" onclick={() => (trapped = false)}>End Trap</button>
    </div>
  </FocusTrap>
</div>
