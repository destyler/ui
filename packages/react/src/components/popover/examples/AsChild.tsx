import { Popover } from '../index'

export function AsChild() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button>Open</button>
      </Popover.Trigger>
    </Popover.Root>
  )
}
