import type { PropTypes } from '@destyler/solid'
import type * as toast from '@destyler/toast'
import type { Accessor, JSX } from 'solid-js'
import { createContext } from '~/utils/create-context'

export interface UseToastContext extends Accessor<toast.Api<PropTypes, JSX.Element>> {}

const toastProviderTuple = createContext<UseToastContext>({
  hookName: 'useToastContext',
  providerName: '<ToastProvider />',
})

export const ToastProvider = toastProviderTuple[0]
export const useToastContext = toastProviderTuple[1]
