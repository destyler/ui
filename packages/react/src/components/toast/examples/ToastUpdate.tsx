import { useMemo, useRef } from 'react'
import { createToaster, Toast, Toaster } from '../index'

export function ToastUpdate() {
  const toaster = useMemo(() => createToaster({ placement: 'bottom-end' }), [])
  const toastIdRef = useRef<string | undefined>(undefined)

  const createToast = () => {
    toastIdRef.current = toaster.create({
      title: 'Original Title',
      description: 'Original Description',
      type: 'info',
    })
  }

  const updateToast = () => {
    if (toastIdRef.current) {
      toaster.update(toastIdRef.current, {
        title: 'Updated Title',
        description: 'Updated Description',
        type: 'success',
      })
    }
  }

  return (
    <>
      <button type="button" onClick={createToast}>Create Toast</button>
      <button type="button" onClick={updateToast}>Update Toast</button>
      <Toaster toaster={toaster}>
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
