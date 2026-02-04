import { useState } from 'react'
import { Tooltip } from '../index'

export function Controlled() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      <Tooltip.Root open={isOpen}>
        <Tooltip.Trigger>Hover Me</Tooltip.Trigger>
        <Tooltip.Positioner>
          <Tooltip.Content>I am a tooltip!</Tooltip.Content>
        </Tooltip.Positioner>
      </Tooltip.Root>
    </>
  )
}
