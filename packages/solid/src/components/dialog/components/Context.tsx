import type { JSX } from 'solid-js'
import type { UseDialogContext } from '../hooks/use-dialog-context'
import { useDialogContext } from '../hooks/use-dialog-context'

export interface DialogContextProps {
  children: (context: UseDialogContext) => JSX.Element
}

export const DialogContext = (props: DialogContextProps) => props.children(useDialogContext())
