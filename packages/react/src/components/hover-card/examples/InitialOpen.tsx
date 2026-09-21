import { HoverCard } from '../index'

export function InitialOpen() {
  return (
    <HoverCard.Root defaultOpen openDelay={0} closeDelay={0}>
      <HoverCard.Trigger>Hover me</HoverCard.Trigger>
      <HoverCard.Positioner>
        <HoverCard.Content>
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          Content
        </HoverCard.Content>
      </HoverCard.Positioner>
    </HoverCard.Root>
  )
}
