import { Dynamic } from '@destyler-ui/solid/dynamic'
import { createSignal, Index } from 'solid-js'

export function Controlled() {
  const [value, setValue] = createSignal(['react', 'solid', 'vue'])

  return (
    <>
      <output>{value().join(', ')}</output>
      <Dynamic.Root value={value()} onValueChange={details => setValue(details.value)}>
        <Dynamic.Context>
          {api => (
            <>
              <Dynamic.Label>Frameworks</Dynamic.Label>
              <Dynamic.Control>
                <Index each={api().value}>
                  {(item, index) => (
                    <Dynamic.Item index={index} value={item()}>
                      <Dynamic.ItemPreview>
                        <Dynamic.ItemText>{item()}</Dynamic.ItemText>
                        <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
                      </Dynamic.ItemPreview>
                      <Dynamic.ItemInput />
                    </Dynamic.Item>
                  )}
                </Index>
                <Dynamic.Input placeholder="Add tag" />
                <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
              </Dynamic.Control>
            </>
          )}
        </Dynamic.Context>
        <Dynamic.HiddenInput />
      </Dynamic.Root>
    </>
  )
}
