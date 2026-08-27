import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Dialog } from '../index'

export function Controlled() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Dialog</button>
      <Dialog.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
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
      </Dialog.Root>
    </>
  )
}
