import { useMemo } from 'react'
import { createToaster, Toast, Toaster } from '../index'

export function ToastPlacement() {
  const toasterTopStart = useMemo(() => createToaster({ placement: 'top-start' }), [])
  const toasterBottomEnd = useMemo(() => createToaster({ placement: 'bottom-end' }), [])

  const createTopStart = () => {
    toasterTopStart.create({
      title: 'Top Start Toast',
      description: 'This toast appears at top-start',
      type: 'info',
    })
  }

  const createBottomEnd = () => {
    toasterBottomEnd.create({
      title: 'Bottom End Toast',
      description: 'This toast appears at bottom-end',
      type: 'info',
    })
  }

  return (
    <>
      <button type="button" onClick={createTopStart}>Top Start</button>
      <button type="button" onClick={createBottomEnd}>Bottom End</button>
      <Toaster toaster={toasterTopStart}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            <Toast.CloseTrigger>x</Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
      <Toaster toaster={toasterBottomEnd}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            <Toast.CloseTrigger>x</Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </>
  )
}
