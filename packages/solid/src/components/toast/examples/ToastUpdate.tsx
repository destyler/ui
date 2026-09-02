import { createToaster, Toast, Toaster } from '@destyler-ui/solid/toast'
import { createSignal } from 'solid-js'

export function ToastUpdate() {
  const toaster = createToaster({ placement: 'bottom-end' })
  const [toastId, setToastId] = createSignal<string | undefined>(undefined)

  const createToast = () => {
    setToastId(toaster.create({
      title: 'Original Title',
      description: 'Original Description',
      type: 'info',
    }))
  }

  const updateToast = () => {
    const id = toastId()
    if (!id)
      return

    toaster.update(id, {
      title: 'Updated Title',
      description: 'Updated Description',
      type: 'success',
    })
  }

  return (
    <>
      <button type="button" onClick={createToast}>Create Toast</button>
      <button type="button" onClick={updateToast}>Update Toast</button>
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast().title}</Toast.Title>
            <Toast.Description>{toast().description}</Toast.Description>
            <Toast.CloseTrigger>x</Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </>
  )
}
