import { useMemo, useState } from 'react'
import { createToaster, Toast, Toaster } from '../index'

interface ToastActionProps {
  duration?: number
}

export function ToastAction(props: ToastActionProps = {}) {
  const toaster = useMemo(() => createToaster({ placement: 'bottom-end' }), [])
  const [actionTriggered, setActionTriggered] = useState(false)

  const createToast = () => {
    setActionTriggered(false)
    toaster.create({
      title: 'File deleted',
      description: 'The file has been deleted',
      type: 'info',
      duration: props.duration,
    })
  }

  const handleAction = () => {
    setActionTriggered(true)
  }

  return (
    <>
      <button type="button" onClick={createToast}>Create Toast</button>
      {actionTriggered && <div>Action triggered!</div>}
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            <Toast.ActionTrigger onClick={handleAction}>Undo</Toast.ActionTrigger>
            <Toast.CloseTrigger>x</Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </>
  )
}
