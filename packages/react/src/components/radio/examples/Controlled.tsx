import { useState } from 'react'
import { Radio } from '../index'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte', disabled: true },
]

export function Controlled() {
  const [value, setValue] = useState('vue')

  return (
    <>
      <output>{value}</output>
      <Radio.Root value={value} onValueChange={details => setValue(details.value)}>
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
    </>
  )
}
