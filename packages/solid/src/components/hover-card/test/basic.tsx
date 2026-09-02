import { Portal } from 'solid-js/web'
import { HoverCard } from '../'

export function ComponentUnderTest(props: HoverCard.RootProps) {
  return (
    <>
      <button
        type="button"
        data-testid="outside"
        style={{ position: 'fixed', right: '0', bottom: '0' }}
      >
        Outside
      </button>
      <HoverCard.Root openDelay={0} closeDelay={0} {...props}>
        <HoverCard.Trigger data-testid="trigger">Hover me</HoverCard.Trigger>
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
    </>
  )
}
