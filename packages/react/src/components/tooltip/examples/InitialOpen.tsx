import { Tooltip } from '../index'

export function InitialOpen() {
  return (
    <Tooltip.Root defaultOpen openDelay={0} closeDelay={0}>
      <Tooltip.Trigger>hover me</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Arrow>
          <Tooltip.ArrowTip />
        </Tooltip.Arrow>
        <Tooltip.Content>content</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  )
}
