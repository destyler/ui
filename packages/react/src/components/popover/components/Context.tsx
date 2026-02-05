import type { ReactNode } from 'react'
import type { UsePopoverContext } from '../hooks/use-popover-context'
import { usePopoverContext } from '../hooks/use-popover-context'

export interface PopoverContextProps {
  children: (context: UsePopoverContext) => ReactNode
}

export const PopoverContext = (props: PopoverContextProps) => props.children(usePopoverContext())
