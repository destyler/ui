import { HoverCard } from '../index'

export function Positioning() {
  return (
    <HoverCard.Root
      positioning={{
        placement: 'right',
        gutter: 12,
      }}
    >
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
