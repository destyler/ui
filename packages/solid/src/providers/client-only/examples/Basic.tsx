import { ClientOnly } from '../ClientOnly'

export function Basic() {
  return (
    <ClientOnly>
      <div>This content is only rendered on the client side.</div>
    </ClientOnly>
  )
}
