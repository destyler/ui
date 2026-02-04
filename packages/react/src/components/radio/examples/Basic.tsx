import { Radio } from '../index'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte', disabled: true },
]

export function Basic() {
  return (
    <Radio.Root>
      <Radio.Label>Framework</Radio.Label>
      <Radio.Indicator />
      {items.map(item => (
        <Radio.Item key={item.value} value={item.value} disabled={item.disabled}>
          <Radio.ItemText>{item.label}</Radio.ItemText>
          <Radio.ItemControl />
          <Radio.ItemHiddenInput />
        </Radio.Item>
      ))}
    </Radio.Root>
  )
}
