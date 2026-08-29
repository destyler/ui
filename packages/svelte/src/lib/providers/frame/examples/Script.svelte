<script lang="ts">
  import { Frame } from '../index'

  let frameRef: HTMLIFrameElement | undefined = $state()

  function handleMount() {
    const doc = frameRef?.contentDocument
    if (!doc) return
    const script = doc.createElement('script')
    script.textContent = 'console.log("Hello from inside the frame!")'
    doc.body.appendChild(script)
  }
</script>

<Frame
  bind:ref={frameRef}
  title="Custom Frame"
  onMount={handleMount}
  style="border: 1px solid #ccc; width: 100%; height: var(--height);"
>
  <div style="padding: 40px;">
    <h1>Hello from inside the frame!</h1>
    <p>This content is rendered within our custom frame component using a Portal.</p>
  </div>
</Frame>
