import { For } from 'solid-js'
import { Radio } from '../'

export function ComponentUnderTest(props: Radio.RootProps) {
  const items = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Svelte', value: 'svelte', disabled: true },
  ]
  return (
    <Radio.Root {...props}>
      <Radio.Label>Framework</Radio.Label>
      <Radio.Indicator />
      <For each={items}>
        {item => (
          <Radio.Item value={item.value} disabled={item.disabled}>
            <Radio.ItemText>{item.label}</Radio.ItemText>
            <Radio.ItemControl />
            <Radio.ItemHiddenInput />
          </Radio.Item>
        )}
      </For>
    </Radio.Root>
  )
}
