import type { UseRadioProps } from '../hooks/use-radio'
import { Radio } from '../index'

const frameworks = ['React', 'Solid', 'Vue']

export function OnEvent(props: { onValueChange?: UseRadioProps['onValueChange'] }) {
  const { onValueChange } = props
  return (
    <Radio.Root onValueChange={onValueChange}>
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
