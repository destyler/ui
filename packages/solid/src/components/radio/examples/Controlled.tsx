import { Radio } from '@destyler-ui/solid/radio'
import { createSignal, For } from 'solid-js'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte', disabled: true },
]

export function Controlled() {
  const [value, setValue] = createSignal('vue')

  return (
    <>
      <output>{value()}</output>
      <Radio.Root value={value()} onValueChange={details => setValue(details.value)}>
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
    </>
  )
}
