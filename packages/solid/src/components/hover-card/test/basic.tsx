import { Portal } from 'solid-js/web'
import { HoverCard } from '../'

export function ComponentUnderTest(props: HoverCard.RootProps) {
  return (
    <HoverCard.Root openDelay={0} closeDelay={0} {...props}>
      <HoverCard.Trigger>Hover me</HoverCard.Trigger>
      <Portal>
        <HoverCard.Positioner data-testid="positioner">
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
