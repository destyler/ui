import { useState } from 'react'
import { Splitter } from '../index'

export function Controlled() {
  const [size, setSize] = useState([
    { id: 'a', size: 50 },
    { id: 'b', size: 50 },
  ])

  return (
    <>
      <output>{size.map(p => p.size).join(' / ')}</output>
      <Splitter.Root
        size={size}
        onSizeChange={(details) => {
          setSize(details.size.map(panel => ({
            id: String(panel.id),
            size: panel.size ?? 0,
          })))
        }}
      >
        <Splitter.Panel id="a">A</Splitter.Panel>
        <Splitter.ResizeTrigger id="a:b">
          <div className="bar"></div>
        </Splitter.ResizeTrigger>
        <Splitter.Panel id="b">B</Splitter.Panel>
      </Splitter.Root>
    </>
  )
}
