import { createPortal } from 'react-dom'
import { Dialog, useDialog } from '../index'

export function RootProvider() {
  const dialog = useDialog()

  return (
    <>
      <button onClick={() => dialog.setOpen(true)}>Open</button>

      <Dialog.RootProvider value={dialog}>
        <Dialog.Trigger>Open Dialog</Dialog.Trigger>
        {createPortal(
          <>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Title>Dialog Title</Dialog.Title>
                <Dialog.Description>Dialog Description</Dialog.Description>
                <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </>,
          document.body,
        )}
      </Dialog.RootProvider>
    </>
  )
}
