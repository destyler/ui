import { Splitter } from '@destyler-ui/solid/splitter'

export function InitialSize() {
  return (
    <Splitter.Root
      defaultSize={[{ id: 'a', size: 30 }, { id: 'b', size: 70 }]}
    >
      <Splitter.Panel id="a">A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">B</Splitter.Panel>
    </Splitter.Root>
  )
}
