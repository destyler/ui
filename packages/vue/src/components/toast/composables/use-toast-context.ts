import type * as toast from '@destyler/toast'
import type { PropTypes } from '@destyler/vue'
import type { ComputedRef } from 'vue'
import { createContext } from '~/utils'

export interface UseToastContext extends ComputedRef<toast.Api<PropTypes>> {}

export const [ToastProvider, useToastContext] = createContext<UseToastContext>('ToastContext')
