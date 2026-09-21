import { Tooltip } from '@destyler-ui/solid/tooltip'
import { Portal } from 'solid-js/web'

export function InitialOpen() {
  return (
    <Tooltip.Root defaultOpen openDelay={0} closeDelay={0}>
      <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>I am a tooltip!</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  )
}
