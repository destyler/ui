<script lang="ts">
  import { Frame } from '../index'
</script>

<Frame title="Custom Frame" style="border: 1px solid #ccc; width: 100%; height: var(--height);">
  <div style="padding: 40px;">
    <h1>Hello from inside the frame!</h1>
    <p>This content is rendered within our custom frame component using a Portal.</p>
  </div>
</Frame>
