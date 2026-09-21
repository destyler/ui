import { Popover } from '../index'

export interface InitialOpenProps {
  lazyMount?: boolean
  unmountOnExit?: boolean
}

export function InitialOpen({ lazyMount, unmountOnExit }: InitialOpenProps) {
  return (
    <Popover.Root lazyMount={lazyMount} unmountOnExit={unmountOnExit} defaultOpen>
