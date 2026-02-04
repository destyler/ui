import { useState } from 'react'
import { Splitter } from '../index'

export function Vertical() {
  const [size] = useState([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])

  return (
    <Splitter.Root size={size} orientation="vertical">
      <Splitter.Panel id="a">A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b" />
      <Splitter.Panel id="b">B</Splitter.Panel>
    </Splitter.Root>
  )
}
