import { Tooltip, useTooltip } from '@destyler-ui/solid/tooltip'
import { Portal } from 'solid-js/web'

export function RootProvider() {
  const tooltip = useTooltip()

  return (
    <>
      <button onClick={() => tooltip().setOpen(true)}>Open</button>

      <Tooltip.RootProvider value={tooltip}>
        <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
        <Portal>
          <Tooltip.Positioner>
            <Tooltip.Content>I am a tooltip!</Tooltip.Content>
          </Tooltip.Positioner>
        </Portal>
      </Tooltip.RootProvider>
    </>
  )
}
