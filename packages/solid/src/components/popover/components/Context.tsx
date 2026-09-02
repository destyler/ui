import type { JSX } from 'solid-js'
import type { UsePopoverContext } from '../hooks/use-popover-context'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverContextProps {
  children: (context: UsePopoverContext) => JSX.Element
}

export const PopoverContext = (props: PopoverContextProps) => props.children(usePopoverContext())
