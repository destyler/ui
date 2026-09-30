import { Splitter } from '../index'

export function RenderProp() {
  return (
    <Splitter.Root
      defaultSize={[
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ]}
    >
      <Splitter.Context>
        {splitter => (
          <>
            <Splitter.Panel id="a">
              <button onClick={() => splitter.setSize('a', 10)}>
                Set A to 10%
              </button>
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="a:b" />
            <Splitter.Panel id="b">
              <button onClick={() => splitter.setSize('b', 10)}>
                Set B to 10%
              </button>
            </Splitter.Panel>
          </>
        )}
      </Splitter.Context>
    </Splitter.Root>
  )
}
