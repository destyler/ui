import { useState } from 'react'
import { Presence } from '../index'

export function UnmountOnExit () {
  const [present, setPresent] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setPresent(!present)}>
        Toggle
      </button>
      <Presence present={present} unmountOnExit>
        Hidden and Unmounted on Exit
      </Presence>
    </>
  )
}
