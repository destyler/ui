import { HoverCard } from '../index'

export function RenderProp() {
  return (
    <HoverCard.Root>
      <HoverCard.Context>
        {hoverCard => (
          <HoverCard.Trigger>
            Hover me
            {hoverCard.open ? ' ▲' : ' ▼'}
          </HoverCard.Trigger>
        )}
      </HoverCard.Context>
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
