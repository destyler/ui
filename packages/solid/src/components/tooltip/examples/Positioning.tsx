import { Tooltip } from '@destyler-ui/solid/tooltip'
import { Portal } from 'solid-js/web'

export function Positioning() {
  return (
    <Tooltip.Root
      positioning={{
        placement: 'left-start',
        offset: { mainAxis: 12, crossAxis: 12 },
      }}
    >
      <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>I am a tooltip!</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  )
}
