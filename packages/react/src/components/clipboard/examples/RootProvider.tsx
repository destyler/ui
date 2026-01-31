import { Clipboard, useClipboard } from '../index'

export function RootProvider() {
  const clipboard = useClipboard({ value: 'https://destyler.org' })

  return (
    <>
      <button onClick={() => clipboard.copy()}>Copy</button>

      <Clipboard.RootProvider value={clipboard}>
        <Clipboard.Label>Copy this link</Clipboard.Label>
        <Clipboard.Control>
          <Clipboard.Input />
          <Clipboard.Trigger>
            <Clipboard.Indicator copied={
              <span>Copied!</span>
            }
            >
              <span>Copy</span>
            </Clipboard.Indicator>
          </Clipboard.Trigger>
        </Clipboard.Control>
      </Clipboard.RootProvider>
    </>
  )
}
