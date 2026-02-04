import { Tooltip, useTooltip } from '../index'

export function RootProvider() {
  const tooltip = useTooltip()

  return (
    <>
      <button onClick={() => tooltip.setOpen(true)}>Open</button>

      <Tooltip.RootProvider value={tooltip}>
        <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>I am a tooltip!</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.RootProvider>
    </>
  )
}
