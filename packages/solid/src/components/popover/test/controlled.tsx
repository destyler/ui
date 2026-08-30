import type { Popover } from '..'
import { createSignal } from 'solid-js'
import { ComponentUnderTest } from './basic'

export function ControlledComponentUnderTest(props: Popover.RootProps) {
  const [open, setOpen] = createSignal(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(prev => !prev)}>
        toggle
      </button>
      <ComponentUnderTest {...props} open={open()} />
    </>
  )
}
