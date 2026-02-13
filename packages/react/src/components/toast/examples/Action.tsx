import { useMemo } from 'react'
import { createToaster, Toast, Toaster } from '../index'

export function Action() {
  const toaster = useMemo(() => createToaster({
    placement: 'bottom-end',
    gap: 24,
  }), [])

  const addToast = () => {
    toaster.create({
      title: 'Toast Title',
      description: 'Toast Description',
      type: 'info',
      action: {
        label: 'Subscribe',
        onClick: () => {
          // eslint-disable-next-line no-console
          console.log('Subscribe')
        },
      },
    })
  }

  return (
    <div>
      <button type="button" onClick={addToast}>Add Toast</button>
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root key={toast.id}>
            <Toast.Title>{toast.title}</Toast.Title>
            <Toast.Description>{toast.description}</Toast.Description>
            {toast.action && <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>}
          </Toast.Root>
        )}
      </Toaster>
    </div>
  )
}
