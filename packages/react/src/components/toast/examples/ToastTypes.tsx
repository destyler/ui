import { useMemo } from 'react'
import { createToaster, Toast, Toaster } from '../index'

export function ToastTypes() {
  const toaster = useMemo(() => createToaster({ placement: 'bottom-end' }), [])

  const createSuccess = () => {
    toaster.success({
      title: 'Success Toast',
      description: 'Operation completed successfully',
    })
  }

  const createError = () => {
    toaster.error({
      title: 'Error Toast',
      description: 'Something went wrong',
    })
  }

  const createLoading = () => {
    toaster.loading({
      title: 'Loading Toast',
      description: 'Please wait...',
    })
  }

  const createInfo = () => {
    toaster.create({
      title: 'Info Toast',
      description: 'Here is some information',
      type: 'info',
    })
  }

  return (
    <>
      <button type="button" onClick={createSuccess}>Success</button>
      <button type="button" onClick={createError}>Error</button>
      <button type="button" onClick={createLoading}>Loading</button>
      <button type="button" onClick={createInfo}>Info</button>
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
