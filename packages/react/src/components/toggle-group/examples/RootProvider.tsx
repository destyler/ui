import { ToggleGroup, useToggleGroup } from '../index'

export function RootProvider() {
  const toggleGroup = useToggleGroup()

  return (
    <>
      <span>{toggleGroup.value.join(', ')}</span>
      <ToggleGroup.RootProvider value={toggleGroup}>
        <ToggleGroup.Item value="a">A</ToggleGroup.Item>
        <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        <ToggleGroup.Item value="c">C</ToggleGroup.Item>
      </ToggleGroup.RootProvider>
    </>
  )
}
