import { createToaster, Toast, Toaster } from '@destyler-ui/solid/toast'
import { createSignal, Show } from 'solid-js'

export function ToastAction() {
  const toaster = createToaster({ placement: 'bottom-end' })
  const [actionTriggered, setActionTriggered] = createSignal(false)

  const createToast = () => {
    setActionTriggered(false)
    toaster.create({
      title: 'File deleted',
      description: 'The file has been deleted',
      type: 'info',
    })
  }

  return (
    <>
      <button type="button" onClick={createToast}>Create Toast</button>
      <Show when={actionTriggered()}>
        <div>Action triggered!</div>
      </Show>
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast().title}</Toast.Title>
            <Toast.Description>{toast().description}</Toast.Description>
            <Toast.ActionTrigger onClick={() => setActionTriggered(true)}>Undo</Toast.ActionTrigger>
            <Toast.CloseTrigger>x</Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </>
  )
}
