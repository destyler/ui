import { Clipboard } from '../index'

export function RenderFn() {
  return (
    <Clipboard.Root value="https://destyler.org">
      <Clipboard.Label>Copy this link</Clipboard.Label>
      <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Context>
            {clipboard => (clipboard.copied ? <span>Copied</span> : <span>Copy</span>)}
          </Clipboard.Context>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>
  )
}
