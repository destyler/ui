import { Popover } from '@destyler-ui/solid/popover'

export function AsChild() {
  return (
    <Popover.Root>
      <Popover.Trigger asChild={props => <button {...props()} />}>Open</Popover.Trigger>
    </Popover.Root>
  )
}
