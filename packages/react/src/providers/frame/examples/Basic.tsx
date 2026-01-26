import { Frame } from '../index'

export function Basic() {
  return (
    <Frame title="Custom Frame" style={{ border: '1px solid #ccc', width: '100%', height: 'var(--height)' }}>
      <div style={{ padding: 40 }}>
        <h1>Hello from inside the frame!</h1>
        <p>This content is rendered within our custom frame component using a Portal.</p>
      </div>
    </Frame>
  )
}
