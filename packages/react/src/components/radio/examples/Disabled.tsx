import { Radio } from '../index'

const frameworks = ['React', 'Solid', 'Vue']

export function Disabled() {
  return (
    <Radio.Root disabled>
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
