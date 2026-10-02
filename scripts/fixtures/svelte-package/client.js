import { hydrate, unmount } from 'svelte'
import Fixture from './Fixture.svelte'

export * as entries from './entries'
export function mount(target, changes) {
  const app = hydrate(Fixture, { target, props: { changes }, recover: false })
  return () => unmount(app)
}
