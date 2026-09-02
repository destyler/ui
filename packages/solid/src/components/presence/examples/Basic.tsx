import { Presence } from '@destyler-ui/solid/presence'
import { createSignal } from 'solid-js'

export function Basic() {
  const [present, setPresent] = createSignal(false)
  return (
    <>
      <button type="button" onClick={() => setPresent(!present())}>
        Toggle
      </button>
      <Presence present={present()}>Hidden and Hidden</Presence>
    </>
  )
}
