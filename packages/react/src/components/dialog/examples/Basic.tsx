import { createPortal } from 'react-dom'
import { Dialog } from '../index'

export function Basic(props: Dialog.RootProps) {
  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner data-testid="positioner">
            <Dialog.Content>
              <Dialog.Title>Dialog Title</Dialog.Title>
              <Dialog.Description>Dialog Description</Dialog.Description>
              <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </>,
        document.body,
      )}
    </Dialog.Root>
  )
}
