import { createToaster, Toast, Toaster } from '../'

const toaster = createToaster({
  placement: 'bottom-end',
})

export function ComponentUnderTest() {
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          toaster.create({
            title: 'Title',
            description: 'Description',
            type: 'info',
          })}
      >
        Create Toast
      </button>
      <Toaster toaster={toaster}>
        {toast => (
          <Toast.Root>
            <Toast.Title>{toast().title}</Toast.Title>
            <Toast.Description>{toast().description}</Toast.Description>
            <Toast.ActionTrigger>Start</Toast.ActionTrigger>
            <Toast.CloseTrigger>Close</Toast.CloseTrigger>
          </Toast.Root>
        )}
      </Toaster>
    </div>
  )
}
