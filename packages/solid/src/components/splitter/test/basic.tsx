import { Splitter } from '../'

export function ComponentUnderTest(props: Splitter.RootProps) {
  return (
    <Splitter.Root
      size={[
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ]}
      {...props}
    >
      <Splitter.Panel id="a">A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b">
        <div class="bar" />
      </Splitter.ResizeTrigger>
      <Splitter.Panel id="b">B</Splitter.Panel>
    </Splitter.Root>
  )
}
