import { Collapsible, Toggle } from '@destyler-ui/solid'
import { createComponent } from 'solid-js'
import { render } from 'solid-js/web'

export * as entries from './entries'
export function mount(container, changes) {
  return render(() => [
    createComponent(Toggle.Root, {
      id: 'packed-toggle',
      defaultPressed: false,
      onPressedChange: value => changes.pressed.push(value),
      children: 'Toggle',
    }),
    createComponent(Collapsible.Root, {
      id: 'packed-collapse',
      defaultOpen: false,
      onOpenChange: details => changes.open.push(details.open),
      get children() {
        return [
          createComponent(Collapsible.Trigger, { children: 'Details' }),
          createComponent(Collapsible.Content, { children: 'Packed content' }),
        ]
      },
    }),
  ], container)
}
