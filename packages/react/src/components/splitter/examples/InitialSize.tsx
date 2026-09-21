import { Splitter } from '../index'

export function InitialSize() {
  return (
    <Splitter.Root
      defaultSize={[{ id: 'a', size: 30 }, { id: 'b', size: 70 }]}
    >
      <Splitter.Panel id="a">A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b">
        <div className="bar"></div>
      </Splitter.ResizeTrigger>
      <Splitter.Panel id="b">B</Splitter.Panel>
    </Splitter.Root>
  )
}
