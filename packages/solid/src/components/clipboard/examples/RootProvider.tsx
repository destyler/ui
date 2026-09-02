import { Clipboard, useClipboard } from '@destyler-ui/solid/clipboard'
import { CheckIcon, ClipboardCopyIcon } from 'lucide-solid'

export function RootProvider() {
  const clipboard = useClipboard({ value: 'https://ui-ui.com' })

  return (
    <>
      <button onClick={() => clipboard().copy()}>Copy</button>

      <Clipboard.RootProvider value={clipboard}>
        <Clipboard.Label>Copy this link</Clipboard.Label>
        <Clipboard.Control>
          <Clipboard.Input />
          <Clipboard.Trigger>
            <Clipboard.Indicator copied={<CheckIcon />}>
              <ClipboardCopyIcon />
            </Clipboard.Indicator>
          </Clipboard.Trigger>
        </Clipboard.Control>
      </Clipboard.RootProvider>
    </>
  )
}
