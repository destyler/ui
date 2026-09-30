import { createSignal } from 'solid-js'
import { Frame } from '../../src/providers/frame'

const firstDocument = '<html><head></head><body><div class="frame-root"></div></body></html>'
const secondDocument = '<html><head></head><body><main class="frame-root"></main></body></html>'

export function FrameFixture(props: { onMount?: () => void, onUnmount?: () => void }) {
  const [count, setCount] = createSignal(0)
  const [srcdoc, setSrcdoc] = createSignal(firstDocument)
  return (
    <div>
      <Frame
        title="Interactive preview"
        srcdoc={srcdoc()}
        head={<style id="frame-head">{'button { color: black; }'}</style>}
        onMount={props.onMount}
        onUnmount={props.onUnmount}
      >
        <button type="button" onClick={() => setCount(count() + 1)}>Count: {count()}</button>
      </Frame>
      <button type="button" onClick={() => setSrcdoc(secondDocument)}>Replace document</button>
      <span>After frame</span>
    </div>
  )
}
