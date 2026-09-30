import { Collapsible, Toggle } from '@destyler-ui/react'
import { createElement } from 'react'

export function Fixture({ onPressedChange, onOpenChange } = {}) {
  return createElement('main', null, createElement(Toggle.Root, { id: 'packed-toggle', onPressedChange }, createElement(Toggle.Indicator, null, 'Pressed'), 'Toggle'), createElement(Collapsible.Root, { id: 'packed-collapsible', onOpenChange }, createElement(Collapsible.Trigger, null, 'Details'), createElement(Collapsible.Content, null, 'Packed consumer content')))
}
