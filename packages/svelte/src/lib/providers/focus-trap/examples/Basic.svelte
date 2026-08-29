<script lang="ts">
  import { FocusTrap } from '../index'

  let trapped = $state(false)
</script>

<button type="button" onclick={() => (trapped = true)}>Start Trap</button>
<FocusTrap returnFocusOnDeactivate={false} disabled={!trapped}>
  <div style="display: flex; flex-direction: column; gap: 1rem; padding-block: 1rem;">
    <input type="text" placeholder="input" />
    <textarea placeholder="textarea"></textarea>
    <button type="button" onclick={() => (trapped = false)}>End Trap</button>
  </div>
</FocusTrap>
