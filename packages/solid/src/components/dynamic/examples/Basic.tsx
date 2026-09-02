import { Dynamic } from '@destyler-ui/solid/dynamic'
import { Index } from 'solid-js'

export function Basic() {
  return (
    <Dynamic.Root>
      <Dynamic.Context>
        {api => (
          <>
            <Dynamic.Label>Frameworks</Dynamic.Label>
            <Dynamic.Control>
              <Index each={api().value}>
                {(value, index) => (
                  <Dynamic.Item index={index} value={value()}>
                    <Dynamic.ItemPreview>
                      <Dynamic.ItemText>{value()}</Dynamic.ItemText>
                      <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                    </Dynamic.ItemPreview>
                    <Dynamic.ItemInput />
                  </Dynamic.Item>
                )}
              </Index>
              <Dynamic.Input placeholder="Add Framework" />
              <Dynamic.ClearTrigger>Clear All</Dynamic.ClearTrigger>
            </Dynamic.Control>
          </>
        )}
      </Dynamic.Context>
      <Dynamic.HiddenInput />
    </Dynamic.Root>
  )
}
