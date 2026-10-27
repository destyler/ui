import { Dialog, Menu, Popover, Tabs } from '@destyler-ui/react'
import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'

function rootProps(props) {
  const { component: _component, ...rest } = props
  return rest
}

function tree(props) {
  const component = props.component ?? 'dialog'
  const passed = rootProps(props)
  if (component === 'popover') {
    return h(Popover.Root, passed, h(Popover.Trigger, null, 'Open'), h(Popover.Positioner, null, h(Popover.Content, null, h(Popover.Title, null, 'Compatibility'), h(Popover.CloseTrigger, null, 'Close'))))
  }
  if (component === 'menu') {
    return h(Menu.Root, passed, h(Menu.Trigger, null, 'Open'), h(Menu.Positioner, null, h(Menu.Content, null, h(Menu.Item, { value: 'alpha' }, 'Alpha'))))
  }
  if (component === 'tabs') {
    return h(Tabs.Root, passed, h(Tabs.List, null, h(Tabs.Trigger, { value: 'alpha' }, 'Alpha'), h(Tabs.Trigger, { value: 'beta' }, 'Beta')), h(Tabs.Content, { value: 'alpha' }, 'Alpha'), h(Tabs.Content, { value: 'beta' }, 'Beta'))
  }
  return h(Dialog.Root, passed, h(Dialog.Trigger, null, 'Open'), h(Dialog.Positioner, null, h(Dialog.Content, null, h(Dialog.Title, null, 'Compatibility'), h(Dialog.CloseTrigger, null, 'Close'))))
}

export function mount(target, props) {
  const root = createRoot(target)
  root.render(tree(props))
  return () => root.unmount()
}
