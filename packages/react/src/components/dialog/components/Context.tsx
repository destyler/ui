import type { ReactNode } from 'react'
import type { UseDialogContext } from '../hooks/use-dialog-context'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogContextProps {
  children: (context: UseDialogContext) => ReactNode
}

export const DialogContext = (props: DialogContextProps) => props.children(useDialogContext())
