import { createElement } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Fixture } from './fixture.mjs'

export function mount(container, changes, onHydrated) {
  const root = hydrateRoot(container, createElement(Fixture, {
    onHydrated,
    onPressedChange: value => changes.pressed.push(value),
    onOpenChange: details => changes.open.push(details.open),
  }), { onRecoverableError: error => console.error(error) })
  return () => root.unmount()
}
