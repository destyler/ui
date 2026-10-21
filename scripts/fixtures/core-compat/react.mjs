import { Dialog } from '@destyler-ui/react'
import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'

export function mount(target, props) {
  const root = createRoot(target)
  root.render(h(Dialog.Root, props, h(Dialog.Trigger, null, 'Open'), h(Dialog.Positioner, null, h(Dialog.Content, null, h(Dialog.Title, null, 'Compatibility'), h(Dialog.CloseTrigger, null, 'Close')))))
  return () => root.unmount()
}
