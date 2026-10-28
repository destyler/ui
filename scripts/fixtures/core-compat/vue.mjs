import { Dialog, Menu, Popover, Tabs } from '@destyler-ui/vue'
import { createApp, h } from 'vue'

function rootProps(props) {
  const { component: _component, ...rest } = props
  return rest
}

function tree(props) {
  const component = props.component ?? 'dialog'
  const passed = rootProps(props)
  if (component === 'popover') {
    return h(Popover.Root, passed, { default: () => [
      h(Popover.Trigger, {}, { default: () => 'Open' }),
      h(Popover.Positioner, {}, { default: () => h(Popover.Content, {}, { default: () => [h(Popover.Title, {}, { default: () => 'Compatibility' }), h(Popover.CloseTrigger, {}, { default: () => 'Close' })] }) }),
    ] })
  }
  if (component === 'menu') {
    return h(Menu.Root, passed, { default: () => [
      h(Menu.Trigger, {}, { default: () => 'Open' }),
      h(Menu.Positioner, {}, { default: () => h(Menu.Content, {}, { default: () => h(Menu.Item, { value: 'alpha' }, { default: () => 'Alpha' }) }) }),
    ] })
  }
  if (component === 'tabs') {
    return h(Tabs.Root, passed, { default: () => [
      h(Tabs.List, {}, { default: () => [
        h(Tabs.Trigger, { value: 'alpha' }, { default: () => 'Alpha' }),
        h(Tabs.Trigger, { value: 'beta' }, { default: () => 'Beta' }),
      ] }),
      h(Tabs.Content, { value: 'alpha' }, { default: () => 'Alpha' }),
      h(Tabs.Content, { value: 'beta' }, { default: () => 'Beta' }),
    ] })
  }
  return h(Dialog.Root, passed, { default: () => [
    h(Dialog.Trigger, {}, { default: () => 'Open' }),
    h(Dialog.Positioner, {}, { default: () => h(Dialog.Content, {}, { default: () => [h(Dialog.Title, {}, { default: () => 'Compatibility' }), h(Dialog.CloseTrigger, {}, { default: () => 'Close' })] }) }),
  ] })
}

export function mount(target, props) {
  const app = createApp({ render: () => tree(props) })
  app.mount(target)
  return () => app.unmount()
}
