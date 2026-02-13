import type { ReactNode } from 'react'
import type { UseToastContext } from '../hooks/use-toast-context'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastContextProps {
  children: (context: UseToastContext) => ReactNode
}

export const ToastContext = (props: ToastContextProps) => props.children(useToastContext())
