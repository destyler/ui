import { useState } from 'react'
import { Presence } from '../index'

export function LazyMount () {
  const [present, setPresent] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setPresent(!present)}>
        Toggle
      </button>
      <Presence present={present} lazyMount>
        Unmounted and Hidden
      </Presence>
    </>
  )
}
