import { Tooltip } from '../index'

export function Timings() {
  return (
    <Tooltip.Root closeDelay={0} openDelay={0} immediate>
      <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>I am a tooltip!</Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  )
}
