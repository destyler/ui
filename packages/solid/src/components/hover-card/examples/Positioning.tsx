import { HoverCard } from '@destyler-ui/solid/hover-card'
import { Portal } from 'solid-js/web'

export function Positioning() {
  return (
    <HoverCard.Root positioning={{ placement: 'right', gutter: 12 }}>
      <HoverCard.Trigger>Hover me</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            Content
          </HoverCard.Content>
        </HoverCard.Positioner>
      </Portal>
    </HoverCard.Root>
  )
}
