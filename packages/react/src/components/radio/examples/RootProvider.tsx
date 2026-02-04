import { Radio, useRadio } from '../index'

const frameworks = ['React', 'Solid', 'Vue']

export function RootProvider() {
  const radio = useRadio()

  return (
    <>
      <button onClick={() => radio.focus()}>Focus</button>

      <Radio.RootProvider value={radio}>
        <Radio.Label>Framework</Radio.Label>
        <Radio.Indicator />
        {frameworks.map(framework => (
          <Radio.Item key={framework} value={framework}>
            <Radio.ItemText>{framework}</Radio.ItemText>
            <Radio.ItemControl />
            <Radio.ItemHiddenInput />
          </Radio.Item>
        ))}
      </Radio.RootProvider>
    </>
  )
}
