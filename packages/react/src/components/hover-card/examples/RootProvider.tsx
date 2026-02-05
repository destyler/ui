import { HoverCard, useHoverCard } from '../index'

export function RootProvider() {
  const hoverCard = useHoverCard()

  return (
    <>
      <button onClick={() => hoverCard.setOpen(true)}>Open</button>

      <HoverCard.RootProvider value={hoverCard}>
        <HoverCard.Trigger>Hover me</HoverCard.Trigger>
        <HoverCard.Positioner>
          <HoverCard.Content>
            <HoverCard.Arrow>
              <HoverCard.ArrowTip />
            </HoverCard.Arrow>
            Content
          </HoverCard.Content>
        </HoverCard.Positioner>
      </HoverCard.RootProvider>
    </>
  )
}
