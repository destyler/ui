import { Tooltip } from '@destyler-ui/solid/tooltip'
import { Portal } from 'solid-js/web'

export function Basic() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>I am a tooltip!</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  )
}
