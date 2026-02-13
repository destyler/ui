import type { PropTypes } from '@destyler/react'
import type * as toast from '@destyler/toast'
import type { ReactNode } from 'react'
import { createContext } from '~/utils/create-context'

export interface UseToastContext extends toast.Api<PropTypes, ReactNode> {}

export const [ToastProvider, useToastContext] = createContext<UseToastContext>({
  name: 'ToastContext',
  hookName: 'useToastContext',
  providerName: '<ToastProvider />',
})
