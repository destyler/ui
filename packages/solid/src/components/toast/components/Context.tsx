import type { JSX } from 'solid-js'
import type { UseToastContext } from '../hooks/use-toast-context'
import { useToastContext } from '../hooks/use-toast-context'

export interface ToastContextProps {
  children: (context: UseToastContext) => JSX.Element
}

export const ToastContext = (props: ToastContextProps) => props.children(useToastContext())
