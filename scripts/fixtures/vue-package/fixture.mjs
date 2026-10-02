import { Collapsible, Toggle, useToggleContext } from '@destyler-ui/vue'
import { defineComponent, h } from 'vue'

const State = defineComponent({ setup() {
  const toggle = useToggleContext()
  return () => h('span', String(toggle.value.pressed))
} })
export function fixture(changes = { pressed: [], open: [] }) {
  return h('main', [
    h(Toggle.Root, { 'id': 'packed-toggle', 'defaultPressed': false, 'onUpdate:modelValue': value => changes.pressed.push(value) }, () => h(State)),
    h(Collapsible.Root, { id: 'packed-collapse', defaultOpen: false, onOpenChange: details => changes.open.push(details.open) }, () => [
      h(Collapsible.Trigger, null, () => 'Details'),
      h(Collapsible.Content, null, () => 'Packed content'),
    ]),
  ])
}
