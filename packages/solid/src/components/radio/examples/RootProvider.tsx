import { Radio, useRadio } from '@destyler-ui/solid/radio'
import { Index } from 'solid-js'

export function RootProvider() {
  const frameworks = ['React', 'Solid', 'Vue']

  const radio = useRadio()

  return (
    <>
      <button onClick={() => radio().focus()}>Focus</button>

      <Radio.RootProvider value={radio}>
        <Radio.Label>Framework</Radio.Label>
        <Radio.Indicator />
        <Index each={frameworks}>
          {framework => (
            <Radio.Item value={framework()}>
              <Radio.ItemText>{framework()}</Radio.ItemText>
              <Radio.ItemControl />
              <Radio.ItemHiddenInput />
            </Radio.Item>
          )}
        </Index>
      </Radio.RootProvider>
    </>
  )
}
