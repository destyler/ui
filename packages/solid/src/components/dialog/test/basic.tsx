import { Portal } from 'solid-js/web'
import { Dialog } from '../'

export function ComponentUnderTest(props: Dialog.RootProps) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner data-testid="positioner">
          <Dialog.Content>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Description>Dialog Description</Dialog.Description>
            <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
