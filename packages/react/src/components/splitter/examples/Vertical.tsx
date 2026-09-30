import { Splitter } from '../index'

export function Vertical() {
  return (
    <Splitter.Root
      defaultSize={[
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ]}
      orientation="vertical"
    >
      <Splitter.Panel id="a">A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">B</Splitter.Panel>
    </Splitter.Root>
  )
}
