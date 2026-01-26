import { useRef } from 'react'
import { Frame } from '../index'

export function Script() {
  const frameRef = useRef<HTMLIFrameElement>(null)

  const onMount = () => {
    const doc = frameRef.current?.contentDocument
    if (!doc)
      return
    const script = doc.createElement('script')
    script.innerHTML = 'console.log("Hello from inside the frame!")'
    doc.body.appendChild(script)
  }

  return (
    <Frame
      ref={frameRef}
      title="Custom Frame"
      onMount={onMount}
      style={{ border: '1px solid #ccc', width: '100%', height: 'var(--height)' }}
    >
      <div style={{ padding: 40 }}>
        <h1>Hello from inside the frame!</h1>
        <p>This content is rendered within our custom frame component using a Portal.</p>
      </div>
    </Frame>
  )
}
