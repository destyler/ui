import { Dynamic } from '@destyler-ui/solid/dynamic'
import { Index } from 'solid-js'

export function InitialValue() {
  return (
    <Dynamic.Root value={['React', 'Solid', 'Vue']}>
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
            <Dynamic.Input placeholder="Add tag" />
            <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
          </>
        )}
      </Dynamic.Context>
      <Dynamic.HiddenInput />
    </Dynamic.Root>
  )
}
