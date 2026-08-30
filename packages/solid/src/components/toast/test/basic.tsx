import { createToaster, Toast, Toaster } from '../'

const toaster = createToaster({
  placement: 'bottom-end',
})

interface ComponentUnderTestProps {
  duration?: number
}

export function ComponentUnderTest(props: ComponentUnderTestProps = {}) {
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          toaster.create({
            title: 'Title',
            description: 'Description',
            type: 'info',
            duration: props.duration,
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
