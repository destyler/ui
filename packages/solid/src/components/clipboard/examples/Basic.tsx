import { Clipboard } from '@destyler-ui/solid/clipboard'
import { CheckIcon, ClipboardCopyIcon } from 'lucide-solid'

export function Basic() {
  return (
    <Clipboard.Root value="https://ui-ui.com">
      <Clipboard.Label>Copy this link</Clipboard.Label>
      <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Indicator copied={<CheckIcon />}>
            <ClipboardCopyIcon />
          </Clipboard.Indicator>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>
  )
}
