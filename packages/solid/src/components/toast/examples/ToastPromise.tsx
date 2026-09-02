import { createToaster, Toast, Toaster } from '@destyler-ui/solid/toast'

const promiseOptions = {
  loading: { title: 'Loading...', description: 'Please wait' },
  success: { title: 'Success!', description: 'Operation completed' },
  error: { title: 'Failed!', description: 'Something went wrong' },
}

export function ToastPromise() {
  const toaster = createToaster({ placement: 'bottom-end' })

  const createSuccessPromise = () => {
    const promise = new Promise<string>((resolve) => {
      setTimeout(() => resolve('done'), 1000)
    })
    toaster.promise(promise, promiseOptions)
  }

  const createErrorPromise = () => {
    const promise = new Promise<string>((_resolve, reject) => {
      setTimeout(() => reject(new Error('error')), 1000)
    })
    toaster.promise(promise, promiseOptions)
  }

  return (
    <>
      <button type="button" onClick={createSuccessPromise}>Promise Success</button>
      <button type="button" onClick={createErrorPromise}>Promise Error</button>
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
