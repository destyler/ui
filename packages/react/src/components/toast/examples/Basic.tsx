import { useMemo } from 'react'
import { createToaster, Toast, Toaster } from '../index'

interface BasicProps {
  duration?: number
}

export function Basic(props: BasicProps = {}) {
  const toaster = useMemo(
    () => createToaster({ placement: 'bottom-end', overlap: true, gap: 24, duration: props.duration }),
    [props.duration],
  )

  const createToast = () => {
    toaster.create({
      title: 'Title',
      description: 'Description',
      type: 'info',
    })
  }

  return (
    <>
      <button type="button" onClick={createToast}>Create Toast</button>
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root key={toast.id}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            <Toast.ActionTrigger>Action</Toast.ActionTrigger>
            <Toast.CloseTrigger>x</Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </>
  )
}
