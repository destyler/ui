import { createSSRApp } from 'vue'
import { fixture } from './fixture.mjs'

export function mount(container, changes) {
  const app = createSSRApp({ render: () => fixture(changes) })
  app.mount(container)
  return () => app.unmount()
}
