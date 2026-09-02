import { Splitter, useSplitter } from '@destyler-ui/solid/splitter'

export function RootProvider() {
  const splitter = useSplitter({ size: [{ id: 'a', size: 50 }] })

  return (
    <>
      <button onClick={() => splitter().setToMaxSize('a')}>Maximize a</button>

      <Splitter.RootProvider value={splitter}>
        <Splitter.Panel id="a">A</Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" />
        <Splitter.Panel id="b">B</Splitter.Panel>
      </Splitter.RootProvider>
    </>
  )
}
