import { Splitter } from '@destyler-ui/solid/splitter'

export function RenderProp() {
  return (
    <Splitter.Root
      size={[
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ]}
    >
      <Splitter.Context>
        {api => (
          <>
            <Splitter.Panel id="a">
              <button type="button" onClick={() => api().setSize('a', 10)}>
                Set to 10%
              </button>
            </Splitter.Panel>
            <Splitter.ResizeTrigger id="a:b" />
            <Splitter.Panel id="b">
              <button type="button" onClick={() => api().setSize('b', 10)}>
                Set to 10%
              </button>
            </Splitter.Panel>
          </>
        )}
      </Splitter.Context>
    </Splitter.Root>
  )
}
