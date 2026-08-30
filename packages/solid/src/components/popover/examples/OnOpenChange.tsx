import { Popover } from '@destyler-ui/solid/popover'
import { ChevronRightIcon } from 'lucide-solid'

export function OnOpenChange() {
  return (
    <Popover.Root onOpenChange={open => console.warn(open ? 'opened' : 'closed')}>
      <Popover.Trigger>
        Click Me
        <Popover.Indicator>
          <ChevronRightIcon />
        </Popover.Indicator>
      </Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          <Popover.Title>Title</Popover.Title>
          <Popover.Description>Description</Popover.Description>
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  )
}
