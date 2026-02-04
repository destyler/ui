import { Radio } from '../index'

const frameworks = ['React', 'Solid', 'Vue']

export function InitialValue() {
  return (
    <Radio.Root defaultValue="Solid">
      <Radio.Label>Framework</Radio.Label>
      <Radio.Indicator />
      {frameworks.map(framework => (
        <Radio.Item key={framework} value={framework}>
          <Radio.ItemText>{framework}</Radio.ItemText>
          <Radio.ItemControl />
          <Radio.ItemHiddenInput />
        </Radio.Item>
      ))}
    </Radio.Root>
  )
}
