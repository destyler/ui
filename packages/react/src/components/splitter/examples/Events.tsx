import { useState } from 'react'
import { Splitter } from '../index'

export function Events() {
  const [size] = useState([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])

  return (
    <Splitter.Root
      size={size}
      // eslint-disable-next-line no-console
      onSizeChange={details => console.log('onSizeChange', details)}
      // eslint-disable-next-line no-console
      onSizeChangeEnd={details => console.log('onSizeChangeEnd', details)}
    >
      <Splitter.Panel id="a">A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">B</Splitter.Panel>
    </Splitter.Root>
  )
}
