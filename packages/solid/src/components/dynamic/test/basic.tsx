import { Index } from 'solid-js'
import { Dynamic } from '../'

export function ComponentUnderTest(props: Dynamic.RootProps) {
  return (
    <Dynamic.Root value={['react', 'solid', 'vue']} {...props}>
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
