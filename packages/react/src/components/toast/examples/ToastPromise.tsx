import { useMemo } from 'react'
import { createToaster, Toast, Toaster } from '../index'

interface ToastPromiseProps {
  duration?: number
  promiseDelay?: number
}

export function ToastPromise(props: ToastPromiseProps = {}) {
  const toaster = useMemo(() => createToaster({ placement: 'bottom-end' }), [])

  const createSuccessPromise = () => {
    toaster.promise(
      new Promise(resolve => setTimeout(() => resolve('done'), props.promiseDelay ?? 1000)),
      {
        loading: { title: 'Loading...', description: 'Please wait' },
        success: { title: 'Success!', description: 'Operation completed' },
        error: { title: 'Failed!', description: 'Something went wrong' },
      },
      { duration: props.duration },
    )
  }

  const createErrorPromise = () => {
    toaster.promise(
      new Promise((_, reject) => setTimeout(() => reject(new Error('error')), props.promiseDelay ?? 1000)),
      {
        loading: { title: 'Loading...', description: 'Please wait' },
        success: { title: 'Success!', description: 'Operation completed' },
        error: { title: 'Failed!', description: 'Something went wrong' },
      },
      { duration: props.duration },
    )
  }

  return (
    <>
      <button type="button" onClick={createSuccessPromise}>Promise Success</button>
      <button type="button" onClick={createErrorPromise}>Promise Error</button>
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
