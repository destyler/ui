import { createToaster, Toast, Toaster } from '@destyler-ui/solid/toast'
import { XIcon } from 'lucide-solid'

export function Basic() {
  const toaster = createToaster({
    placement: 'bottom-end',
    gap: 24,
  })

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          toaster.create({
            title: 'Loading!',
            description: 'We are loading something for you. Please wait.',
            type: 'info',
          })}
      >
        Add Toast
      </button>
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast().title}</Toast.Title>
            <Toast.Description>{toast().description}</Toast.Description>
            <Toast.CloseTrigger>
              <XIcon />
            </Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  )
}
