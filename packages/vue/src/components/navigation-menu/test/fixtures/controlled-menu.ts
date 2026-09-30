import type { UseNavigationMenuProps } from '../../index'
import { defineComponent, h } from 'vue'
import { NavigationMenu, useNavigationMenu } from '../../index'

export const entries = ['Root', 'RootProvider', 'hook'] as const
export const initialCases = [
  { name: 'null', modelValue: null, expected: null },
  { name: 'empty', modelValue: '', expected: '' },
  { name: 'non-empty', modelValue: 'two', expected: 'two' },
  { name: 'undefined', modelValue: undefined, expected: 'one' },
]

export function controlledMenu(entry: typeof entries[number], props: UseNavigationMenuProps, onRender: (api: any) => void) {
  const renderParts = (api: any) => {
    onRender(api)
    const output = h('output', { 'data-value': String(api.value), 'data-open': String(api.open) })
    if (entry === 'hook') {
      return h('nav', api.getRootProps(), [
        h('ul', api.getListProps(), ['one', 'two'].map(value => h('li', api.getItemProps({ value }), [
          h('button', api.getTriggerProps({ value }), value),
          h('div', api.getContentProps({ value }), `${value} content`),
        ]))),
        h('div', api.getViewportPositionerProps()),
        output,
      ])
    }
    return [
      h(NavigationMenu.List, {}, () => ['one', 'two'].map(value => h(NavigationMenu.Item, { value }, () => [
        h(NavigationMenu.Trigger, { value }, () => value),
        h(NavigationMenu.Content, { value }, () => `${value} content`),
      ]))),
      h(NavigationMenu.ViewportPositioner),
      output,
    ]
  }
  return defineComponent({
    setup() {
      if (entry === 'Root')
        return () => h(NavigationMenu.Root, props, () => h(NavigationMenu.Context, {}, { default: renderParts }))
      const menu = useNavigationMenu(props)
      if (entry === 'hook')
        return () => renderParts(menu.api.value)
      return () => h(NavigationMenu.RootProvider, { value: menu }, () => h(NavigationMenu.Context, {}, { default: renderParts }))
    },
  })
}
