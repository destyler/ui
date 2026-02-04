import { useState } from 'react'
import { Splitter } from '../index'

export function Basic() {
  const [size] = useState([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])

  return (
    <Splitter.Root size={size}>
      <Splitter.Panel id="a">A</Splitter.Panel>
      <Splitter.ResizeTrigger id="a:b">
        <div className="bar"></div>
      </Splitter.ResizeTrigger>
      <Splitter.Panel id="b">B</Splitter.Panel>
    </Splitter.Root>
  )
}
