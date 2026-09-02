import { ClientOnly } from '../ClientOnly'

export function WithFallback() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <div>This content is only rendered on the client side.</div>
    </ClientOnly>
  )
}
