import { mount as mountComponent, unmount } from 'svelte'
import Fixture from './Fixture.svelte'

export function mount(target, props) {
  const app = mountComponent(Fixture, { target, props: { options: props } })
  return () => unmount(app)
}
