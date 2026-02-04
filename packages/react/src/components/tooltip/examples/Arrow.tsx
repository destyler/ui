import { Tooltip } from '../index'

export function Arrow() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Content>
          <Tooltip.Arrow>
            <Tooltip.ArrowTip />
          </Tooltip.Arrow>
          I am a tooltip!
        </Tooltip.Content>
      </Tooltip.Positioner>
    </Tooltip.Root>
  )
}
