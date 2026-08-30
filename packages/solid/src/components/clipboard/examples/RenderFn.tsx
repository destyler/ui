import { Clipboard } from '@destyler-ui/solid/clipboard'
import { CheckIcon, ClipboardCopyIcon } from 'lucide-solid'
import { Show } from 'solid-js'

export function RenderFn() {
  return (
    <Clipboard.Root value="https://ui-ui.com">
      <Clipboard.Label>Copy this link</Clipboard.Label>
      <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger>
          <Clipboard.Context>
            {context => (
              <Show when={context().copied} fallback={<ClipboardCopyIcon />}>
                <CheckIcon />
              </Show>
            )}
          </Clipboard.Context>
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Clipboard.Root>
  )
}
