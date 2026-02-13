import { useMemo, useRef } from 'react'
import { createToaster, Toast, Toaster } from '../index'

export function Update() {
  const toaster = useMemo(() => createToaster({
    placement: 'bottom-end',
    overlap: true,
    gap: 24,
  }), [])

  const idRef = useRef<string | undefined>(undefined)

  const createToast = () => {
    idRef.current = toaster.create({
      title: 'Loading',
      description: 'Loading ...',
      type: 'info',
    })
  }

  const updateToast = () => {
    if (!idRef.current) {
      return
    }
    toaster.update(idRef.current, {
      title: 'Success',
      description: 'Success!',
    })
  }

  return (
    <div>
      <button type="button" onClick={createToast}>Create Toast</button>
      <button type="button" onClick={updateToast}>Update Toast</button>
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  )
}
