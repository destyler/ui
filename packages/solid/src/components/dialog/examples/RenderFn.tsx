import { Dialog } from '@destyler-ui/solid/dialog'
import { Portal } from 'solid-js/web'

export function RenderFn() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>Dialog Description</Dialog.Description>
            <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
      <Dialog.Context>
        {context => <p>Dialog is {context().open ? 'open' : 'closed'}</p>}
      </Dialog.Context>
    </Dialog.Root>
  )
}
