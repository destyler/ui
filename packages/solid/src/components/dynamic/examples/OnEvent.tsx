import { Dynamic } from '@destyler-ui/solid/dynamic'
import { Index } from 'solid-js'

export function OnEvent() {
  return (
    <Dynamic.Root
      onValueChange={(details) => {
        console.warn('tags changed to:', details.value)
      }}
      onHighlightChange={(details) => {
        console.warn('highlighted tag:', details.highlightedValue)
      }}
      onValueInvalid={(details) => {
        console.warn('Invalid!', details.reason)
      }}
      max={3}
      allowOverflow
      validate={(details) => {
        return !details.value.includes(details.inputValue)
      }}
    >
      <Dynamic.Context>
        {api => (
          <>
            <Dynamic.Label>Frameworks</Dynamic.Label>
            <Dynamic.Control>
              <Index each={api().value}>
                {(value, index) => (
                  <Dynamic.Item index={index} value={value()}>
                    <Dynamic.ItemText>{value()}</Dynamic.ItemText>
                    <Dynamic.ItemInput />
                    <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                  </Dynamic.Item>
                )}
              </Index>
            </Dynamic.Control>
            <Dynamic.Input placeholder="Add Framework" />
            <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
          </>
        )}
      </Dynamic.Context>
      <Dynamic.HiddenInput />
    </Dynamic.Root>
  )
}
