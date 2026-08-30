import { Radio } from '@destyler-ui/solid/radio'
import { Index } from 'solid-js'

export function Basic() {
  const frameworks = ['React', 'Solid', 'Vue']

  return (
    <Radio.Root>
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
    </Radio.Root>
  )
}
