import { useState } from 'react'
import { Splitter, useSplitter } from '../index'

export function RootProvider() {
  const [size] = useState([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])

  const splitter = useSplitter({ size })

  return (
    <>
      <button onClick={() => splitter.setToMaxSize('a')}>Maximize a</button>

      <Splitter.RootProvider value={splitter}>
        <Splitter.Panel id="a">A</Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b" />
        <Splitter.Panel id="b">B</Splitter.Panel>
      </Splitter.RootProvider>
    </>
  )
}
