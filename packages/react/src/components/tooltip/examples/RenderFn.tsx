import { Tooltip } from '../index'

export function RenderFn() {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
      <Tooltip.Positioner>
        <Tooltip.Context>
          {tooltip => (
            <Tooltip.Content>
              This tooltip is open:
              {tooltip.open.toString()}
            </Tooltip.Content>
          )}
        </Tooltip.Context>
      </Tooltip.Positioner>
    </Tooltip.Root>
  )
}
